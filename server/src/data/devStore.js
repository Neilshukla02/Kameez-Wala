import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { seedProducts } from './seedProducts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataDirectory = path.resolve(__dirname, '../../.data')
const dataFilePath = path.join(dataDirectory, 'dev-store.json')

function shouldPersistToDisk() {
  return !process.env.VERCEL
}

function createId() {
  return crypto.randomBytes(12).toString('hex')
}

function withTimestamps(record) {
  const timestamp = new Date().toISOString()
  return {
    ...record,
    createdAt: record.createdAt || timestamp,
    updatedAt: timestamp,
  }
}

function createSeedProduct(product) {
  return withTimestamps({
    _id: createId(),
    ...product,
  })
}

function createUser({ name, email, password, role = 'user' }) {
  return withTimestamps({
    _id: createId(),
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 10),
    role,
  })
}

function createInitialStore() {
  return {
    users: [
      createUser({
        name: 'Admin User',
        email: 'admin@kameezwala.local',
        password: 'admin123',
        role: 'admin',
      }),
    ],
    products: seedProducts.map(createSeedProduct),
    carts: [],
    orders: [],
  }
}

function ensureDataDirectory() {
  fs.mkdirSync(dataDirectory, { recursive: true })
}

function normalizeStore(store) {
  const initialStore = createInitialStore()

  return {
    users: Array.isArray(store?.users) && store.users.length ? store.users : initialStore.users,
    products: Array.isArray(store?.products) && store.products.length ? store.products : initialStore.products,
    carts: Array.isArray(store?.carts) ? store.carts : [],
    orders: Array.isArray(store?.orders) ? store.orders : [],
  }
}

function writeStoreToDisk(store) {
  if (!shouldPersistToDisk()) {
    return
  }

  ensureDataDirectory()
  fs.writeFileSync(dataFilePath, JSON.stringify(store, null, 2))
}

function loadStoreFromDisk() {
  if (!shouldPersistToDisk()) {
    return createInitialStore()
  }

  try {
    if (!fs.existsSync(dataFilePath)) {
      const initialStore = createInitialStore()
      writeStoreToDisk(initialStore)
      return initialStore
    }

    const fileContents = fs.readFileSync(dataFilePath, 'utf8')
    return normalizeStore(JSON.parse(fileContents))
  } catch {
    const initialStore = createInitialStore()
    writeStoreToDisk(initialStore)
    return initialStore
  }
}

export const devStore = loadStoreFromDisk()

function persistStore() {
  writeStoreToDisk(devStore)
}

export function isMemoryMode() {
  return process.env.USE_IN_MEMORY_DB === 'true'
}

export function sanitizeUser(user) {
  if (!user) return null

  const { password, ...safeUser } = user
  return safeUser
}

export function findUserByEmail(email) {
  return devStore.users.find((user) => user.email === email.toLowerCase())
}

export function findUserById(userId) {
  return devStore.users.find((user) => String(user._id) === String(userId))
}

export function createMemoryUser(payload) {
  const user = createUser(payload)
  devStore.users.push(user)
  persistStore()
  return user
}

export function getMemoryProducts({ category, search } = {}) {
  return devStore.products
    .filter((product) => {
      const categoryMatch = !category || category === 'All' || product.category === category
      const searchMatch = !search || product.name.toLowerCase().includes(search.toLowerCase())
      return categoryMatch && searchMatch
    })
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
}

export function findProductById(productId) {
  return devStore.products.find((product) => String(product._id) === String(productId))
}

export function createMemoryProduct(payload) {
  const product = withTimestamps({
    _id: createId(),
    ...payload,
  })
  devStore.products.unshift(product)
  persistStore()
  return product
}

export function updateMemoryProduct(productId, payload) {
  const product = findProductById(productId)
  if (!product) return null

  Object.assign(product, payload, { updatedAt: new Date().toISOString() })
  persistStore()
  return product
}

export function deleteMemoryProduct(productId) {
  const index = devStore.products.findIndex((product) => String(product._id) === String(productId))
  if (index === -1) return false

  devStore.products.splice(index, 1)
  persistStore()
  return true
}

function attachSaveMethods(cart) {
  return {
    ...cart,
    save: async () => cart,
    populate: async () => cart,
  }
}

export function getMemoryCart(userId) {
  let cart = devStore.carts.find((entry) => String(entry.user) === String(userId))

  if (!cart) {
    cart = withTimestamps({
      _id: createId(),
      user: userId,
      items: [],
    })
    devStore.carts.push(cart)
    persistStore()
  }

  return attachSaveMethods(cart)
}

export function getPopulatedMemoryCart(userId) {
  const cart = getMemoryCart(userId)

  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      product: findProductById(item.product),
    })),
  }
}

export function addMemoryCartItem(userId, { productId, quantity, selectedSize }) {
  const cart = getMemoryCart(userId)
  const existingItem = cart.items.find(
    (item) => String(item.product) === String(productId) && item.selectedSize === selectedSize,
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      _id: createId(),
      product: productId,
      quantity,
      selectedSize,
    })
  }

  cart.updatedAt = new Date().toISOString()
  persistStore()
  return getPopulatedMemoryCart(userId)
}

export function removeMemoryCartItem(userId, itemId) {
  const cart = getMemoryCart(userId)
  cart.items = cart.items.filter((item) => String(item._id) !== String(itemId))
  cart.updatedAt = new Date().toISOString()
  persistStore()
  return getPopulatedMemoryCart(userId)
}

export function updateMemoryCartItem(userId, itemId, quantity) {
  const cart = getMemoryCart(userId)
  const item = cart.items.find((entry) => String(entry._id) === String(itemId))

  if (!item) return null

  item.quantity = Math.max(1, quantity)
  cart.updatedAt = new Date().toISOString()
  persistStore()
  return getPopulatedMemoryCart(userId)
}

export function createMemoryOrder(userId, address) {
  const cart = getPopulatedMemoryCart(userId)
  if (!cart.items.length) return null

  const products = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images?.[0] || '',
    price: item.product.price,
    quantity: item.quantity,
    selectedSize: item.selectedSize,
  }))

  const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const order = withTimestamps({
    _id: createId(),
    user: userId,
    products,
    totalPrice,
    status: 'Pending',
    address,
  })

  devStore.orders.unshift(order)
  const cartRecord = devStore.carts.find((entry) => String(entry.user) === String(userId))
  if (cartRecord) {
    cartRecord.items = []
    cartRecord.updatedAt = new Date().toISOString()
  }

  persistStore()
  return order
}

export function getMemoryOrders(userId) {
  return devStore.orders.filter((order) => String(order.user) === String(userId))
}
