<template>
  <div class="w-full mb-10">
    <div class="w-full flex justify-center items-center">
      <img src="/images/pricelist.webp" alt="price-list" class="my-10" />
    </div>
    <div class="w-full flex flex-col justify-center items-center">
      <span class="text-4xl font-[Coiny] text-[#f25a1a] block mb-10">Danh sách phòng</span>
      <Carousel
        :autoplay="3000"
        :dir="'ltr'"
        :snapAlign="'center'"
        :itemsToShow="2"
        :itemsToScroll="1"
        :wrapAround="true"
        :transition="1000"
      />
    </div>
    <div class="w-[1156px] mx-auto mt-20">
      <div class="w-full flex justify-start items-center space-x-10">
        <div class="flex flex-col justify-center items-center space-y-2">
          <span class="block w-18 h-5 border border-[#f25a1a] rounded-full"></span>
          <span class="font-[Coiny] text-slate-700 block">Trống</span>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2">
          <span class="block w-18 h-5 border border-[#cd6b58] bg-[#cd6b58] rounded-full"></span>
          <span class="font-[Coiny] text-slate-700 block">Đang chọn</span>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2">
          <span class="block w-18 h-5 border border-[#f25a1a] bg-[#f25a1a] rounded-full"></span>
          <span class="font-[Coiny] text-slate-700 block">Đã đặt</span>
        </div>
        <div class="flex flex-col justify-center items-center space-y-2">
          <span class="block w-18 h-5 bg-[#9e8a86] rounded-full"></span>
          <span class="font-[Coiny] text-slate-700 block">Giữ chỗ</span>
        </div>
      </div>
      <div class="flex items-center space-x-1">
        <InformationCircleIcon class="w-6 h-6 text-[#f25a1a]" />
        <span class="text-sm font-semibold text-[#f25a1a]"
          >Các slot giữ chỗ tối đa 15 phút , sau 15 phút sẽ giải phóng chỗ cho khách hàng khách đặt
          phòng</span
        >
      </div>
      <div class="w-full border border-[#f25a1a] mt-4">
        <Table
          :rooms="rooms"
          :bookings="bookingStore.getOrders"
          :today="timestamp"
          :numRow="numRow"
        />
      </div>
      <div class="w-full flex justify-center items-center mt-4">
        <button
          @click="handleLoadMore"
          v-if="numRow < MAX_ROW"
          class="bg-[#f25a1a] text-white px-4 py-2 rounded-full hover:bg-[#f2371a]"
        >
          Xem thêm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Carousel from '@/components/kits/carousel/index.vue'
import Table from '@/components/kits/table/index.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { useBookingStore } from '@/stores'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

const bookingStore = useBookingStore()

const today = new Date()
const timestamp = today.getTime()
const rooms = ref([])
const numRow = ref(7)
const MAX_ROW = 28

const fetchData = async () => {
  try {
    const [roomsResponse, ordersResponse] = await Promise.all([
      axios.get('https://homestay-be-rv98.onrender.com/api/public/rooms'),
      axios.get('https://homestay-be-rv98.onrender.com/api/public/bookings'),
    ])
    rooms.value = roomsResponse.data.rooms
    bookingStore.addOrder(ordersResponse.data.bookings)
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
}

defineExpose({
  fetchData,
})

const handleLoadMore = () => {
  if (numRow.value < MAX_ROW) {
    numRow.value += 7
  }
}

onMounted(() => {
  fetchData()
})
</script>
