<template>
  <div class="h-screen flex">
    <div class="w-90 bg-slate-700 h-full">
      <div class="p-8">
        <span class="font-[Coiny] text-4xl text-white">Dashboard</span>
        <div class="flex items-center justify-between space-x-2 mt-2 border-b border-white">
          <div class="flex items-center space-x-2">
            <UserCircleIcon class="w-6 h-6 text-white" />
            <span class="font-[Coiny] text-2xl text-white">{{ user.name }}</span>
          </div>
          <button
            @click="logout"
            class="text-white px-2 py-1 rounded-lg hover:underline hover:cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
        <div class="mt-8">
          <ul class="divide-y divide-gray-600">
            <li
              v-for="model in models"
              :key="model.key"
              class="px-4 flex items-center space-x-2 cursor-pointer duration-300 hover:font-semibold hover:bg-[rgba(255,255,255,0.1)]"
            >
              <component
                :is="model.icon"
                class="w-6 h-6 text-gray-500"
                :class="{ 'text-white font-semibold': model.id === currentModel.id }"
              />
              <span
                @click="changeModel(model)"
                class="py-2 text-gray-500 block w-full"
                :class="{ 'text-white font-semibold': model.id === currentModel.id }"
                >{{ model.name }}</span
              >
            </li>
          </ul>
        </div>
      </div>
      <div></div>
    </div>
    <div class="w-full">
      <KeepAlive>
        <component :is="currentModel.component" />
      </KeepAlive>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { UserCircleIcon, ClockIcon, HomeIcon } from '@heroicons/vue/24/outline'
import { toast } from 'vue-sonner'
import Bookings from '@/components/models/bookings/index.vue'
import Rooms from '@/components/models/rooms/index.vue'
import { vi } from 'date-fns/locale'
import { KeepAlive } from 'vue'

const router = useRouter()
const user = ref({})
const token = localStorage.getItem('token')
const models = [
  {
    id: 1,
    name: 'Booking',
    key: 'bookings',
    component: Bookings,
    active: true,
    icon: ClockIcon,
  },
  {
    id: 2,
    name: 'Room',
    key: 'rooms',
    component: Rooms,
    active: false,
    icon: HomeIcon,
  },
]

const currentModel = shallowRef(models[0])

const changeModel = (model) => {
  currentModel.value = model
}

function checkAuth() {
  if (!token) {
    router.push('/admin/login')
  } else {
    user.value = jwtDecode(token)
  }
}

function logout() {
  localStorage.removeItem('token')
  user.value = {}
  toast.info('Đã đăng xuất')
  router.push('/admin/login')
}

onMounted(() => {
  checkAuth()
})
</script>
