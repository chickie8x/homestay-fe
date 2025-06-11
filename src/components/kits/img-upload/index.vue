<template>
  <div class="flex flex-col space-y-1">
    <label
      v-if="!img"
      for="img"
      class="flex items-center space-x-1 px-2 py-1 w-fit border border-slate-300 rounded-full bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all duration-300"
    >
      <CloudArrowUpIcon class="w-5 h-5 text-slate-500 cursor-pointer" />
      <span class="text-slate-500 text-xs">Chọn file</span>
      <input type="file" @change="getImg" id="img" class="hidden" />
    </label>
    <div v-else class="relative">
      <div v-if="!url" class="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
      <img :src="thumbnail" alt="img" class="w-full h-20 object-cover" />
      <button
        v-if="!loading && !url"
        @click="img = null"
        class="absolute top-0 right-0 flex items-center justify-center cursor-pointer hover:bg-slate-400 rounded-full transition-all duration-300"
      >
        <XMarkIcon class="w-6 h-6 text-white cursor-pointer" />
      </button>
      <button
        v-if="!loading && !url"
        @click="uploadImg()"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group rounded-full transition-all duration-300"
      >
        <ArrowUpTrayIcon class="w-6 h-6 text-white cursor-pointer group-hover:text-[#eef21a]" />
      </button>
      <Loading
        v-if="loading && !url"
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group rounded-full transition-all duration-300 w-6 h-6 text-white cursor-pointer group-hover:text-[#eef21a]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Loading from '@/components/icons/loading.vue'
import { CloudArrowUpIcon, XMarkIcon, ArrowUpTrayIcon } from '@heroicons/vue/24/outline'
import axios from 'axios'
import { toast } from 'vue-sonner'

const loading = ref(false)
const apiBase = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_IMAGEBB_API
const img = ref(null)
const thumbnail = ref(null)
const url = ref(null)

const emit = defineEmits(['update:modelValue'])

const getImg = (e) => {
  img.value = e.target.files[0]
  thumbnail.value = URL.createObjectURL(e.target.files[0])
}

const uploadImg = () => {
  loading.value = true
  const formData = new FormData()
  formData.append('image', img.value)
  axios
    .post(`${apiBase}/upload`, formData, {
      params: {
        key: apiKey,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      url.value = response.data.data.url
      emit('update:modelValue', {
        img: img.value,
        thumbnail: thumbnail.value,
        url: url.value,
      })
      loading.value = false
    })
    .catch((error) => {
      toast.error('Lỗi khi tải ảnh')
      loading.value = false
    })
}
</script>
