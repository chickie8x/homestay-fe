<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <h1 class="text-2xl font-bold text-[#f25a1a] text-center font-[Coiny]">
      Thanh toán thành công
    </h1>
    <p class="text-center mt-4 text-slate-500">
      Đơn hàng của bạn đã được thanh toán thành công, thông tin về đơn hàng sẽ được gửi đến email
      của bạn
    </p>
    <button
      @click="handleBackToHome"
      class="bg-[#f25a1a] text-white px-4 py-2 rounded-full hover:bg-[#f2371a] mt-8"
    >
      Quay lại trang chủ
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBackToHome = () => {
  router.push('/')
}
</script>
