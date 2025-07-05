<template>
  <div
    class="w-full border-2 border-[#f25a1a] rounded-lg p-4 shadow-lg flex hover:bg-[rgba(242,90,26,0.1)] transition-all duration-300"
  >
    <div class="flex flex-col w-1/2">
      <div class="flex items-center space-x-1">
        <HomeIcon class="w-5 h-5 text-slate-700" />
        <span class="text-xl font-[Coiny] text-slate-700 mt-1">{{ room.name }}</span>
        <div class="flex items-center space-x-2 ml-8">
          <button
            class="text-[#f25a1a] p-1 rounded-lg border border-[#f25a1a] hover:bg-[#f25a1a] hover:text-white transition-all duration-300 cursor-pointer"
            @click="updateRoom"
          >
            <PencilIcon class="w-5 h-5" />
          </button>
          <button
            class="text-[#f25a1a] p-1 rounded-lg border border-[#f25a1a] hover:bg-[#f25a1a] hover:text-white transition-all duration-300 cursor-pointer"
            @click="deleteRoom"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex items-center space-x-1">
          <CurrencyDollarIcon class="w-5 h-5 text-slate-700" />
          <span class="font-semibold text-slate-700 text-xl">Giá</span>
        </div>
        <div class="flex space-x-8 mt-2 flex-wrap">
          <div
            v-for="timeRange in room.timeRanges"
            :key="timeRange.id"
            class="flex flex-col items-center"
          >
            <div class="flex items-center space-x-1">
              <ClockIcon class="w-4 h-4" />
              <span class="text-sm font-semibold text-slate-700">{{
                `${timeRange.start} - ${timeRange.end}`
              }}</span>
            </div>
            <span class="font-[Coiny] text-xl text-[#f25a1a] font-semibold">{{
              `${currencyFormat(timeRange.price)}`
            }}</span>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <div class="flex items-center space-x-1">
          <BoltIcon class="w-5 h-5 text-slate-700" />
          <span class="font-semibold text-xl text-slate-700">Tiện ích</span>
        </div>
        <div class="flex space-x-8 space-y-4 mt-2 flex-wrap w-full">
          <div
            v-for="(amenity, idx) in room.amenities"
            :key="idx"
            class="flex flex-col items-center"
          >
            <div class="flex items-center space-x-1">
              <SparklesIcon class="w-4 h-4 text-[#f25a1a]" />
              <span class="font-[Coiny] text-xl text-[#f25a1a] whitespace-nowrap">{{
                amenity
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <span class="text-sm text-slate-700"
          >Cập nhật lần cuối :
          <span class="font-semibold">{{ formatDate(room.updatedAt) }}</span></span
        >
      </div>
    </div>
    <div class="w-1/2">
      <Carousel :items-to-show="1" :wrap-around="true" :autoplay="3000" class="!h-full">
        <Slide v-for="(image, idx) in room.images" :key="idx">
          <img :src="image" alt="Room Image" class="w-full h-full object-cover" />
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </div>
  </div>
</template>

<script setup>
import { currencyFormat } from '@/utils'
import {
  ClockIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BoltIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import axios from 'axios'
import { formatDate } from '@/utils'
import { toast } from 'vue-sonner'

const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['deleteRoom', 'updateRoom'])

const token = localStorage.getItem('token')
const deleteRoom = async () => {
  try {
    await axios.delete(
      `https://homestay-be-rv98.onrender.com/api/admin/cms/room/${props.room.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    toast.success('Đã xóa phòng')
    emit('deleteRoom')
  } catch (error) {
    console.error(error)
    toast.error('Lỗi khi xóa phòng')
  }
}

const updateRoom = () => {
  emit('updateRoom', props.room)
}
</script>
