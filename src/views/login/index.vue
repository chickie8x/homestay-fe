<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <span class="font-[Coiny] text-4xl text-[#f25a1a]">Login</span>
    <form
      @submit.prevent="handleSubmit"
      class="flex flex-col justify-center items-center mt-4 w-full max-w-[500px]"
    >
      <input
        type="text"
        placeholder="email"
        v-model="email"
        class="bg-white bg-opacity-10 text-[#f25a1a] w-90 mb-2 px-4 py-2 rounded-full border border-[#f25a1a] outline-none"
      />
      <input
        type="password"
        placeholder="password"
        v-model="password"
        class="bg-white bg-opacity-10 text-[#f25a1a] w-90 mb-2 px-4 py-2 rounded-full border border-[#f25a1a] outline-none"
      />
      <button
        type="submit"
        :disabled="isLoading"
        class="shadow-lg font-[Coiny] w-90 bg-[#f25a1a] text-white px-4 py-2 rounded-full hover:bg-[#f2371a] mt-8 flex items-center justify-center"
      >
        {{ isLoading ? 'Đang đăng nhập' : 'Đăng nhập' }}
        <Loading v-if="isLoading" class="ml-2" />
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { toast } from 'vue-sonner'
import Loading from '@/components/icons/loading.vue'

const email = ref('')
const password = ref('')
const router = useRouter()
const isLoading = ref(false)

const handleSubmit = () => {
  const data = { email: email.value, password: password.value }
  isLoading.value = true
  axios
    .post('https://homestay-be-rv98.onrender.com/api/auth/login', data)
    .then((response) => {
      console.log(response)
      localStorage.setItem('token', response.data.token)
      toast.success('Đăng nhập thành công')
      router.push('/admin/dashboard')
      isLoading.value = false
    })
    .catch((error) => {
      console.log(error)
      toast.error(error.response.data.message)
      isLoading.value = false
    })
}
</script>
