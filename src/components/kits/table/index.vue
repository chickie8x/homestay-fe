<template>
  <div class="w-full overflow-x-auto relative font-[Coiny] text-slate-700">
    <table class="w-full border-separate border-spacing-0">
      <thead class="border-separate border-spacing-0">
        <tr class="border-separate border-spacing-0">
          <th
            colspan="2"
            class="whitespace-nowrap w-[108px] py-1 sticky left-0 bg-[#f7f2d7] border border-[#f25a1a]"
          >
            Tên Phòng
          </th>
          <th
            v-for="(room, idx) in headers.hd1"
            :key="room.key"
            :colspan="room.length"
            class="px-4 py-1 border border-[#f25a1a]"
            :class="roomClass[room.key]"
          >
            {{ room.label }}
          </th>
        </tr>
        <tr class="border-separate border-spacing-0">
          <th class="w-[108px] py-1 sticky left-0 bg-[#f7f2d7] border border-[#f25a1a]">Thứ</th>
          <th class="w-[108px] py-1 sticky left-[108px] bg-[#f7f2d7] border border-[#f25a1a]">
            Ngày
          </th>
          <th
            v-for="(time, idx) in headers.hd2"
            :key="time.key"
            :colspan="time.length"
            class="px-4 py-2 whitespace-nowrap border border-[#f25a1a]"
            :class="roomClass[time.classKey]"
          >
            {{ time.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="date in dates" :key="date.date">
          <td
            class="px-4 py-2 border border-[#f25a1a] whitespace-nowrap sticky left-0 bg-[#f7f2d7]"
          >
            {{ date.weekDay }}
          </td>
          <td
            class="px-4 py-2 border border-[#f25a1a] whitespace-nowrap sticky left-[108px] bg-[#f7f2d7]"
          >
            {{ date.date }}
          </td>
          <td
            v-for="(time, idx) in headers.hd2"
            :key="idx"
            class="px-4 py-1 border border-[#f25a1a]"
            :class="roomClass[time.classKey]"
          >
            <div
              v-if="available[`${time.key}-${date.date}`]"
              class="flex justify-center items-center select-none"
            >
              <span
                class="text-white text-xs font-sans font-semibold w-18 h-5 flex justify-center items-center rounded-full cursor-not-allowed"
                :class="
                  available[`${time.key}-${date.date}`] !== 'PAID' ? 'bg-[#9e8a86]' : 'bg-[#f25a1a]'
                "
                >{{ available[`${time.key}-${date.date}`] === 'PAID' ? 'Đã đặt' : 'Giữ chỗ' }}</span
              >
            </div>
            <div v-else class="flex justify-center items-center">
              <button
                @click="handleClick(time.classKey, time.value, date.date, idx)"
                class="border border-[#f25a1a] bg-[#f7f2d7] w-[64px] h-[18px] rounded-full hover:bg-[#fed7aa]"
                :class="
                  markSelected[`${time.classKey}-${time.key}-${date.date}`] ? '!bg-[#cd6b58]' : ''
                "
              ></button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useBookingStore } from '@/stores'
import { toast } from 'vue-sonner'
import { formatDate } from '@/utils'

const bookingStore = useBookingStore()

const bookingEnt = computed(() => bookingStore.getBooking)
const props = defineProps({
  rooms: {
    type: Array,
    required: true,
    default: [],
  },
  bookings: {
    type: Array,
    required: true,
    default: [],
  },
  today: {
    type: Number,
    required: true,
    default: new Date().getTime(),
  },
  numRow: {
    type: Number,
    required: true,
    default: 7,
  },
})

const headers = computed(() => {
  const ret = {
    hd1: [],
    hd2: [],
  }
  props.rooms.map((room, idx) => {
    ret.hd1.push({
      key: room.id,
      label: room.name,
      value: room,
      length: room.timeRanges.length,
    })
    room.timeRanges.map((timeRange) => {
      ret.hd2.push({
        key: timeRange.id,
        label: `${timeRange.start} - ${timeRange.end}`,
        value: timeRange,
        classKey: room.id,
      })
    })
  })

  return ret
})

const available = computed(() => {
  let ret = {}
  props.bookings.map((booking) => {
    booking.timeRange.map((timeRange) => {
      ret[`${timeRange.id}-${formatDate(booking.bookingDate, 'dd/MM/yyyy')}`] = booking.state
    })
  })
  return ret
})

const roomClass = computed(() => {
  let ret = {}
  props.rooms.map((room, idx) => {
    ret[room.id] = idx % 2 !== 0 ? 'bg-[#f7f2d7]' : 'bg-[#fed7aa]'
  })
  return ret
})

const dates = computed(() => {
  let ret = []
  for (let i = 0; i < props.numRow; i++) {
    ret.push({
      weekDay: format(new Date(props.today + i * 86400000), 'EEEE', { locale: vi }),
      date: formatDate(props.today + i * 86400000, 'dd/MM/yyyy'),
    })
  }
  return ret
})

const markSelected = ref({})
const minPoint = ref(null)
const maxPoint = ref(null)

const handleClick = (roomId, timeRange, date, idx) => {
  if (bookingEnt.value.roomId && bookingEnt.value.roomId !== roomId) {
    toast.error('Chọn khung giờ trong cùng phòng')
    return
  }
  if (bookingEnt.value.date && bookingEnt.value.date !== date) {
    toast.error('Chọn khung giờ trong cùng ngày')
    return
  }

  if (minPoint.value === null && maxPoint.value === null) {
    minPoint.value = idx
    maxPoint.value = idx
  } else {
    if (idx === minPoint.value - 1) {
      minPoint.value = idx
    } else if (idx === maxPoint.value + 1) {
      maxPoint.value = idx
    } else if (idx === minPoint.value) {
      minPoint.value = idx + 1
    } else if (idx === maxPoint.value) {
      maxPoint.value = idx - 1
    } else {
      toast.error('Chọn khung giờ liền kề')
      return
    }
  }

  if (minPoint.value > maxPoint.value) {
    minPoint.value = null
    maxPoint.value = null
  }

  markSelected.value[`${roomId}-${timeRange.id}-${date}`] =
    !markSelected.value[`${roomId}-${timeRange.id}-${date}`]
  if (markSelected.value[`${roomId}-${timeRange.id}-${date}`]) {
    const room = headers.value.hd1.find((room) => room.key === roomId)
    bookingStore.addTimeRage({
      roomId,
      timeRange,
      date,
      cost: timeRange.price,
      roomName: room.label,
    })
  } else {
    bookingStore.removeTimeRange({
      roomId,
      timeRange,
      date,
    })
  }
}
</script>
