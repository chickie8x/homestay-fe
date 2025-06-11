<template>
  <div class="w-full max-w-[540px] mx-auto h-full flex flex-col items-center justify-center p-8">
    <Loading v-if="loading" :color="'#f25a1a'" />
    <div v-else class="w-full p-4 bg-white rounded-md shadow-md">
      <h1 class="text-2xl font-bold text-[#f25a1a] text-center font-[Coiny]">Thanh toán</h1>
      <div class="mt-4 space-y-2 divide-y divide-slate-200">
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Khách hàng:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.customerName }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Số điện thoại:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.customerPhone }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Email:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.customerEmail }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Ngày đặt:</span>
          <span class="text-[#f25a1a] font-semibold">{{
            booking.bookingDate ? formatDate(booking.bookingDate) : ''
          }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Phòng:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.room?.name }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Check-in:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.checkin }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Check-out:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.checkout }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Số người:</span>
          <span class="text-[#f25a1a] font-semibold">{{ booking.numberOfPeople }}</span>
        </div>
        <div class="flex items-center px-2 py-2">
          <span class="w-[150px] text-slate-700">Tổng tiền:</span>
          <span class="text-[#f25a1a] font-semibold">{{ currencyFormat(booking.totalCost) }}</span>
        </div>
      </div>
    </div>
    <div v-if="!loading" class="mt-4 flex items-center justify-end space-x-2">
      <button
        @click="doCheckout"
        class="px-2 py-1 min-w-[120px] flex items-center justify-center cursor-pointer bg-[#f25a1a] text-white rounded-md transition-all duration-300 hover:bg-[#f2371a] hover:text-white"
      >
        <Loading v-if="checkoutLoading" />
        {{ checkoutLoading ? 'Đang thanh toán...' : 'Thanh toán' }}
      </button>
      <button
        @click="cancelCheckout"
        class="px-2 py-1 min-w-[120px] flex items-center justify-center cursor-pointer bg-white text-[#f25a1a] rounded-md transition-all duration-300 border border-[#f25a1a]"
      >
        Hủy
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue-sonner'
import Loading from '@/components/icons/loading.vue'
import { formatDate, currencyFormat } from '@/utils'
import router from '@/router'

const route = useRoute()
const bookingId = route.params.id
const loading = ref(false)
const booking = ref({})
const checkoutLoading = ref(false)

const getBooking = async () => {
  try {
    loading.value = true
    const response = await axios.get(`https://homestay-be-rv98.onrender.com/api/public/bookings/${bookingId}`)
    booking.value = response.data.booking
    console.log(booking.value)
  } catch (error) {
    console.error(error)
    toast.error('Đã có lỗi xảy ra')
    loading.value = false
  } finally {
    loading.value = false
  }
}

const doCheckout = async () => {
  try {
    checkoutLoading.value = true
    const data = {
      amount: booking.value.totalCost,
      description: 'Đặt phòng',
      bookingId: booking.value.id,
    }
    const response = await axios.post(
      'https://homestay-be-rv98.onrender.com/api/public/payment/create-payment-link',
      data,
    )
    console.log(response.data)
    checkoutLoading.value = false
    console.log(response.data.paymentLink)
    window.location.href = response.data.paymentLink.checkoutUrl
  } catch (error) {
    console.error(error)
    toast.error('Đã có lỗi xảy ra')
    checkoutLoading.value = false
  } finally {
    checkoutLoading.value = false
  }
}

const cancelCheckout = () => {
  router.push('/payment')
}

onMounted(() => {
  getBooking()
})
</script>
