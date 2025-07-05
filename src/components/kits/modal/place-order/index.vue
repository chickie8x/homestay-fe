<template>
  <div class="w-full max-w-[540px] bg-white rounded-2xl shadow-2xl p-4">
    <div class="flex justify-between items-center w-full">
      <span class="font-[Coiny] text-xl text-[#f25a1a]">Đặt phòng {{ booking.roomName }}</span>
      <button
        @click="emit('close')"
        class="flex items-center justify-center cursor-pointer hover:bg-red-100 rounded-full transition-all duration-300"
      >
        <XMarkIcon class="w-6 h-6 text-red-500 cursor-pointer" />
      </button>
    </div>
    <div class="w-full mt-4">
      <div class="flex items-center space-x-2">
        <span class="text-slate-700">Ngày đặt:</span>
        <span class="font-semibold text-green-600">{{ booking.date }}</span>
      </div>
      <div class="mt-4 text-slate-700">
        <span class="text-slate-700">Giờ đặt:</span>
        <div class="flex items-center justify-between text-sm mt-1">
          <span
            class="font-semibold text-blue-600 block px-2 py-1 rounded-sm bg-blue-50 border border-blue-100"
            >{{ `Check-in: ${booking.timeRange[0].start} ngày ${booking.date}` }}</span
          >
          <span
            class="font-semibold text-orange-600 block px-2 py-1 rounded-sm bg-orange-50 border border-orange-100"
            >{{
              `Check-out: ${booking.timeRange[booking.timeRange.length - 1].end} ngày ${checkoutDate}`
            }}</span
          >
        </div>
      </div>
      <div class="mt-4 text-slate-700 flex flex-col space-y-1">
        <span class="text-slate-700"
          >Số người <span class="text-red-600 font-semibold text-xl">*</span>:</span
        >
        <span class="text-sm text-slate-500">Nếu ở quá 2 người sẽ phụ thu 50,000đ/1 người</span>
        <div class="flex items-center justify-between space-x-2 mt-1">
          <button
            @click="numDecrease"
            class="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer hover:bg-slate-100"
          >
            <MinusIcon class="w-6 h-6 text-slate-500" />
          </button>
          <span
            class="font-semibold block h-8 flex-1 text-center border border-slate-300 rounded-md"
            >{{ numPeople }}</span
          >
          <button
            @click="numIncrease"
            class="flex items-center justify-center rounded-full border border-slate-300 cursor-pointer hover:bg-slate-100"
          >
            <PlusIcon class="w-6 h-6 text-slate-500" />
          </button>
        </div>
      </div>
      <div class="mt-4 text-slate-700 flex flex-col space-y-1">
        <div class="flex items-center space-x-2">
          <span>Tổng tiền:</span>
          <span class="font-semibold text-xl text-[#f25a1a]">{{ currencyFormat(totalCost) }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-[#f25a1a] text-sm">{{
            `Giảm giá ${discountPercentage}% - Gốc ${currencyFormat(cost + extraPeople * 50000)} `
          }}</span>
        </div>
        <div v-if="extraPeople > 0" class="flex items-center space-x-2">
          <span class="text-[#f25a1a] text-sm">{{ `Phụ thu ${extraPeople} khách` }}</span>
        </div>
      </div>
      <div class="mt-4 text-slate-700 flex flex-col space-y-2">
        <div class="flex flex-col space-y-1">
          <label for="customerName"
            >Họ tên<span class="text-red-600 font-semibold text-xl">*</span>:</label
          >
          <input
            v-model="customerName"
            type="text"
            id="customerName"
            class="border border-slate-300 rounded-md px-2 py-1 outline-[#f25a1a] focus:outline-[#f25a1a]"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="customerPhone"
            >Số điện thoại<span class="text-red-600 font-semibold text-xl">*</span>:</label
          >
          <span class="text-xs text-slate-500">Thông tin liên hệ</span>
          <input
            v-model="customerPhone"
            type="tel"
            id="customerPhone"
            class="border border-slate-300 rounded-md px-2 py-1 outline-[#f25a1a] focus:outline-[#f25a1a]"
          />
        </div>
        <div class="flex flex-col space-y-1">
          <label for="customerEmail"
            >Email<span class="text-red-600 font-semibold text-xl">*</span>:</label
          >
          <span class="text-xs text-slate-500">Để nhận thông tin đặt phòng</span>
          <input
            v-model="customerEmail"
            type="email"
            id="customerEmail"
            class="border border-slate-300 rounded-md px-2 py-1 outline-[#f25a1a] focus:outline-[#f25a1a]"
          />
        </div>
      </div>
      <div class="mt-4 flex items-center space-x-20">
        <div class="flex flex-col space-y-1">
          <span class="text-slate-700"
            >Ảnh mặt trước CCCD <span class="text-red-600 font-semibold text-xl">*</span></span
          >
          <span class="text-xs text-slate-500">Dùng để khai báo cư trú</span>
          <imgUpload v-model="frontID" />
        </div>
        <div class="flex flex-col space-y-1">
          <span class="text-slate-700"
            >Ảnh mặt sau CCCD <span class="text-red-600 font-semibold text-xl">*</span></span
          >
          <span class="text-xs text-slate-500">Dùng để khai báo cư trú</span>
          <imgUpload v-model="backID" />
        </div>
      </div>
      <div class="mt-4 flex items-center justify-start">
        <Turnstile :siteKey="turnstileSiteKey" v-model="turnstileToken" />
      </div>
      <div class="mt-4 flex items-center space-x-2">
        <input type="checkbox" v-model="agreement" id="terms" class="w-4 h-4" />
        <label for="terms"
          >Tôi đã đọc và đồng ý với các
          <a href="" class="text-[#f25a1a] hover:underline">điều khoản và điều kiện</a></label
        >
      </div>
      <div class="mt-4 flex items-center justify-end space-x-2">
        <button
          @click="placeOrder"
          class="px-2 py-1 flex items-center justify-center cursor-pointer bg-[#f25a1a] text-white rounded-md transition-all duration-300 hover:bg-[#f2371a] hover:text-white disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          :disabled="!turnstileToken"
        >
          <Loading v-if="doPlaceOrder" />
          {{ doPlaceOrder ? 'Đang đặt phòng...' : 'Đặt phòng' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '@/stores'
import { parse, format } from 'date-fns'
import { currencyFormat, discountPercentageCalc } from '@/utils'
import axios from 'axios'
import { toast } from 'vue-sonner'
import imgUpload from '@/components/kits/img-upload/index.vue'
import Loading from '@/components/icons/loading.vue'
import Turnstile from '@/components/kits/turnstile/index.vue'

const customerName = ref('')
const customerPhone = ref('')
const customerEmail = ref('')
const turnstileToken = ref('')
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

const router = useRouter()
const frontID = ref({
  img: null,
  thumbnail: null,
  url: null,
})
const backID = ref({
  img: null,
  thumbnail: null,
  url: null,
})

watch(frontID, () => {
  if (frontID.value.url) {
    console.log(frontID.value)
  }
})
watch(backID, () => {
  if (backID.value.url) {
    console.log(backID.value)
  }
})

const bookingStore = useBookingStore()
const numPeople = ref(2)
const extraPeople = ref(0)
const agreement = ref(false)
const doPlaceOrder = ref(false)
const cost = computed(() =>
  bookingStore.getBooking.timeRange.reduce((acc, timeRange) => acc + timeRange.price, 0),
)
const totalCost = computed(
  () => cost.value - (cost.value * discountPercentage.value) / 100 + extraPeople.value * 50000,
)
const discountPercentage = computed(() => {
  return discountPercentageCalc(bookingStore.getBooking.timeRange)
})

const emit = defineEmits(['close'])

const booking = computed(() => bookingStore.getBooking)
booking.value.timeRange.sort((a, b) => {
  const [aHours, aMinutes] = a.start.split(':').map(Number)
  const [bHours, bMinutes] = b.start.split(':').map(Number)
  if (aHours !== bHours) return aHours - bHours
  return aMinutes - bMinutes
})
const checkoutDate = computed(() => {
  const date = parse(booking.value.date, 'dd/MM/yyyy', new Date())
  if (
    booking.value.timeRange[booking.value.timeRange.length - 1].start >
    booking.value.timeRange[booking.value.timeRange.length - 1].end
  ) {
    date.setDate(date.getDate() + 1)
  }
  return format(date, 'dd/MM/yyyy')
})

const numDecrease = () => {
  if (numPeople.value > 1) {
    numPeople.value--
    extraPeople.value = numPeople.value - 2 > 0 ? numPeople.value - 2 : 0
  }
}
const numIncrease = () => {
  if (numPeople.value < 3) {
    numPeople.value++
    extraPeople.value = numPeople.value - 2 > 0 ? numPeople.value - 2 : 0
  }
}

const placeOrder = async () => {
  if (!customerName.value || !customerPhone.value || !customerEmail.value) {
    toast.error('Vui lòng nhập đầy đủ thông tin')
    return
  }
  if (!frontID.value.url || !backID.value.url) {
    toast.error('Vui lòng upload ảnh mặt trước và mặt sau CCCD')
    return
  }
  if (!agreement.value) {
    toast.error('Vui lòng đồng ý với các điều khoản và điều kiện')
    return
  }
  doPlaceOrder.value = true
  const data = {
    customerName: customerName.value,
    customerPhone: customerPhone.value,
    customerEmail: customerEmail.value,
    cccdFront: frontID.value.url,
    cccdBack: backID.value.url,
    roomId: booking.value.roomId,
    bookingDate: parse(booking.value.date, 'dd/MM/yyyy', new Date()),
    timeRange: JSON.stringify(booking.value.timeRange),
    totalCost: totalCost.value,
    checkin: `${booking.value.timeRange[0].start} - ${booking.value.date}`,
    checkout: `${booking.value.timeRange[booking.value.timeRange.length - 1].end} - ${checkoutDate.value}`,
    numberOfPeople: numPeople.value,
    turnstileToken: turnstileToken.value
  }
  try {
    const response = await axios.post(
      'https://homestay-be-rv98.onrender.com/api/public/bookings/create',
      data,
    )
    doPlaceOrder.value = false
    console.log(response.data)
    emit('close')
    router.push(`/payment/${response.data.booking.id}`)
  } catch (error) {
    console.error(error)
    toast.error(error.response.data.message || 'Đã có lỗi xảy ra')
  } finally {
    doPlaceOrder.value = false
  }
}
</script>
