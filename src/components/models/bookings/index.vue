<template>
  <div class="w-full h-full p-8">
    <div class="pb-2 flex justify-between border-b border-[rgba(242,90,26,0.2)]">
      <span class="font-[Coiny] text-2xl text-[#f25a1a]">Quản lý Booking</span>
    </div>
    <div class="mt-8">
      <div v-if="listLoading" class="flex justify-center items-center p-4">
        <Loading class="w-5 h-5" color="#D93F21" />
      </div>
      <div v-else class="flex flex-col space-y-2">
        <div v-for="booking in bookings" :key="booking.id" class="flex items-center space-x-2">
          <span>{{ booking.customerName }}</span>
          <span>{{ booking.customerPhone }}</span>
          <span>{{ booking.customerEmail }}</span>
          <span>{{ booking.bookingDate }}</span>
          <span>{{ booking.checkin }}</span>
          <span>{{ booking.checkout }}</span>
          <span>{{ booking.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Loading from '@/components/icons/loading.vue'
import { toast } from 'vue-sonner'

const token = localStorage.getItem('token')
const listLoading = ref(false)
const bookings = ref([])

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await axios.get('https://homestay-be-rv98.onrender.com/api/public/bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
    bookings.value = response.data.bookings
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi tải dữ liệu')
  } finally {
    listLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
