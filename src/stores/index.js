import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    booking: {
      roomId: null,
      roomName: null,
      timeRange: [],
      date: null,
    },
    orders: [],
  }),
  getters: {
    getBooking: (state) => state.booking,
    getOrders: (state) => state.orders,
  },
  actions: {
    addTimeRage(book) {
      if (!this.booking.roomId) {
        this.booking.roomId = book.roomId
      }
      if (!this.booking.date) {
        this.booking.date = book.date
      }
      this.booking.timeRange.push(book.timeRange)
      this.booking.roomName = book.roomName
    },
    removeTimeRange(book) {
      this.booking.timeRange = this.booking.timeRange.filter(
        (timeRange) => timeRange.id !== book.timeRange.id,
      )
      if (this.booking.timeRange.length === 0) {
        this.booking.roomId = null
        this.booking.date = null
        this.booking.roomName = null
      }
    },
    addOrder(order) {
      this.orders = order
    },
  },
})
