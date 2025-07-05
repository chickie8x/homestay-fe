<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <h1 class="text-2xl font-bold text-[#f25a1a] text-center font-[Coiny]">
      Thanh toán không thành công
    </h1>
    <button
      @click="handleBackToHome"
      class="bg-[#f25a1a] mt-8 text-white px-4 py-2 rounded-full hover:bg-[#f2371a]"
    >
      Quay lại trang chủ
    </button>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const { bookingId, orderCode } = route.query
const loading = ref(false)

const cancelBooking = async () => {
  try {
    loading.value = true
    const response = await axios.post(
      `https://homestay-be-rv98.onrender.com/api/public/bookings/cancel`,
      {
        bookingId,
        orderCode,
      },
    )
    console.log(response.data)
    toast.success('Hủy đơn thành công')
  } catch (error) {
    console.error(error)
    toast.error(error.response.data.message || 'Đã có lỗi xảy ra')
  } finally {
    loading.value = false
  }
}

const handleBackToHome = () => {
  router.push('/')
}

onMounted(() => {
  cancelBooking()
})
</script>
