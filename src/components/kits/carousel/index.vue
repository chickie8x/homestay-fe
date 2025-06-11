<template>
  <Carousel class="w-full">
    <Slide v-for="slide in rooms" :key="slide.id">
      <template #default="{ isActive }">
        <div
          class="carousel__item grid grid-cols-2 grid-rows-7 gap-4 border-2 border-[#f25a1a] rounded-lg p-4 w-[600px] h-[600px] scale-80"
          :class="{ 'scale-100': isActive }"
        >
          <div class="col-span-2 row-span-4">
            <img :src="slide.imgPrimary" alt="" class="h-full object-cover rounded-lg" />
          </div>
          <div class="col-span-2 row-span-2 flex flex-col">
            <div class="grid grid-cols-2 gap-4 w-full">
              <img :src="slide.imgSecondary1" alt="" class="w-full object-cover rounded-lg" />
              <img :src="slide.imgSecondary2" alt="" class="w-full object-cover rounded-lg" />
            </div>
          </div>
          <div class="col-span-2 row-span-1 flex flex-col items-center">
            <span class="text-2xl font-[Coiny] text-[#f25a1a]">La Maison</span>
            <span class="text-xl font-[Coiny] text-[#f25a1a]">{{ slide.name }}</span>
          </div>
        </div>
      </template>
    </Slide>
  </Carousel>
</template>

<script setup>
// If you are using PurgeCSS, make sure to whitelist the carousel CSS classes
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { ref } from 'vue'

const rooms = ref([
  {
    id: 1,
    name: 'Room 1',
    price: 1000000,
    imgPrimary: '/images/rooms/room1/primary.webp',
    imgSecondary1: '/images/rooms/room1/secondary1.webp',
    imgSecondary2: '/images/rooms/room1/secondary2.webp',
  },
  {
    id: 2,
    name: 'Room 2',
    price: 1000000,
    imgPrimary: '/images/rooms/room2/primary.webp',
    imgSecondary1: '/images/rooms/room2/secondary1.webp',
    imgSecondary2: '/images/rooms/room2/secondary2.webp',
  },
  {
    id: 3,
    name: 'Room 3',
    price: 1000000,
    imgPrimary: '/images/rooms/room3/primary.webp',
    imgSecondary1: '/images/rooms/room3/secondary1.webp',
    imgSecondary2: '/images/rooms/room3/secondary2.webp',
  },
  {
    id: 4,
    name: 'Room 4',
    price: 1000000,
    imgPrimary: '/images/rooms/room4/primary.webp',
    imgSecondary1: '/images/rooms/room4/secondary1.webp',
    imgSecondary2: '/images/rooms/room4/secondary2.webp',
  },
])
</script>
