<template>
  <div class="w-full h-full p-8 overflow-y-auto">
    <div class="pb-2 flex justify-between border-b border-[rgba(242,90,26,0.2)]">
      <span class="font-[Coiny] text-2xl text-[#f25a1a]">Quản lý Phòng</span>
      <button
        @click="openDialog"
        class="bg-[#f25a1a] shadow-sm text-white px-2 py-1 rounded-lg hover:bg-[#f2371a] flex items-center space-x-2 cursor-pointer"
      >
        <PlusIcon class="w-5 h-5" /> Tạo mới
      </button>
    </div>
    <div class="mt-8">
      <div v-if="listLoading" class="flex justify-center items-center p-4">
        <Loading class="w-5 h-5" color="#D93F21" />
      </div>
      <div v-else class="flex flex-col space-y-4">
        <div v-if="rooms.length" class="flex flex-col space-y-4">
          <RoomCell
            v-for="(room, index) in rooms"
            :key="index"
            :room="room"
            @deleteRoom="getRooms"
            @updateRoom="updateRoom"
          />
        </div>
        <div v-else class="flex flex-col space-y-4">
          <span class="text-slate-700 text-sm font-semibold">Không có phòng</span>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <Modal :open="open" @close="closeDialog">
      <div
        class="flex flex-col space-y-2 w-full max-w-[540px] bg-gray-100 rounded-lg shadow-xl p-4"
      >
        <span class="text-xl font-bold mb-2 block text-[#f25a1a] font-[Coiny]">{{
          action === 'create' ? 'Tạo phòng mới' : 'Cập nhật phòng'
        }}</span>
        <div class="text-sm mt-4">
          <div class="flex flex-col space-y-2">
            <label for="name" class="text-slate-700 text-sm font-semibold">Tên phòng</label>
            <input
              v-model="roomName"
              type="text"
              id="name"
              class="w-full border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 bg-white shadow-sm"
            />
          </div>
          <div class="flex flex-col space-y-2 mt-4">
            <label for="description" class="text-slate-700 text-sm font-semibold">Mô tả</label>
            <textarea
              v-model="roomDescription"
              id="description"
              class="w-full border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 resize-none bg-white shadow-sm"
            ></textarea>
          </div>
          <div class="flex flex-col space-y-2 mt-4">
            <div class="flex items-center space-x-2">
              <span class="text-slate-700 text-sm font-semibold">Khung giờ</span>
              <button
                class="rounded-md hover:bg-[rgba(242,90,26,0.1)] border"
                :class="[
                  !openTimeRange
                    ? 'bg-[rgba(242,90,26,0.1)] text-[#f25a1a]'
                    : 'bg-red-200 text-red-600 border-red-600 hover:bg-red-300',
                ]"
              >
                <PlusIcon @click="openTimeRange = true" class="w-5 h-5" v-if="!openTimeRange" />
                <XMarkIcon @click="openTimeRange = false" class="w-5 h-5" v-if="openTimeRange" />
              </button>
            </div>
            <div
              class="flex items-center space-x-2 h-0 duration-300 overflow-hidden"
              :class="{ 'h-14 duration-300': openTimeRange }"
            >
              <div>
                <label for="start" class="text-slate-700 text-sm font-semibold">Bắt đầu</label>
                <input
                  type="time"
                  id="start"
                  v-model="startTime"
                  class="w-full border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 bg-white shadow-sm"
                />
              </div>
              <div>
                <label for="end" class="text-slate-700 text-sm font-semibold">Kết thúc</label>
                <input
                  type="time"
                  id="end"
                  v-model="endTime"
                  class="w-full border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 bg-white shadow-sm"
                />
              </div>
              <div class="flex items-center space-x-2 pt-5">
                <button
                  @click="addTimeRange"
                  class="text-green-600 bg-green-200 hover:bg-green-300 rounded-md p-[2px] cursor-pointer duration-200 border border-green-400"
                >
                  <CheckIcon class="w-5 h-5" />
                </button>
                <button
                  @click="resetTimeRange"
                  class="text-orange-600 bg-orange-200 hover:bg-orange-300 rounded-md p-[2px] cursor-pointer duration-200 border border-orange-400"
                >
                  <ArrowPathIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-2 mt-4">
            <span class="text-slate-700 text-sm font-semibold">Giá phòng</span>
            <div class="grid grid-cols-3 gap-4">
              <div v-for="(timeRange, index) in timeRanges" :key="index">
                <span>{{ timeRange.start }} - {{ timeRange.end }}</span>
                <input
                  v-model="timeRange.price"
                  type="number"
                  class="w-full border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-2 mt-4">
            <span class="text-slate-700 text-sm font-semibold">Tiện ích phòng</span>
            <div>
              <div v-if="roomAmenities.length" class="flex flex-wrap gap-2">
                <div
                  v-for="(amenity, index) in roomAmenities"
                  :key="index"
                  class="shadow-sm px-2 py-1 flex items-center justify-center space-x-1 rounded-full border border-[#f25a1a] bg-[rgba(242,90,26,0.1)] text-[#f25a1a]"
                >
                  <span>{{ amenity }}</span>
                  <button
                    @click="removeRoomAmenity(index)"
                    class="text-red-600 rounded-full hover:bg-red-300 flex justify-center items-center p-1 cursor-pointer duration-200"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div class="flex items-center space-x-4" :class="{ 'mt-4': roomAmenities.length }">
                <input
                  @keyup.enter="addRoomAmenity"
                  v-model="roomAmenity"
                  type="text"
                  class="max-w-40 border border-slate-300 rounded-lg px-2 py-1 outline-[#f25a1a] text-slate-700 bg-white shadow-sm"
                />
                <div class="text-[#f25a1a] flex items-center">
                  <InformationCircleIcon class="w-5 h-5 mr-1" /> Bấm enter để thêm tiện ích
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-slate-700 text-sm font-semibold">Upload ảnh</span>
            <div class="flex flex-wrap gap-2" v-if="action === 'create'">
              <div v-for="(image, index) in roomImages" :key="index" class="relative">
                <div
                  v-if="!image.uploaded"
                  class="w-full h-full bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex justify-center items-center"
                >
                  <ArrowUpTrayIcon
                    v-if="!image.uploading && !image.uploaded"
                    @click="uploadImage(image.img, index)"
                    class="w-5 h-5 text-white hover:text-orange-500 cursor-pointer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                  <Loading v-if="image.uploading" class="w-5 h-5 text-white" />
                </div>
                <img :src="image.thumbnail" class="w-24 h-24 object-cover" />
              </div>
            </div>
            <div class="flex flex-wrap gap-2" v-else>
              <div v-for="(image, index) in roomImages" :key="index" class="relative">
                <img :src="image" class="w-24 h-24 object-cover" />
              </div>
            </div>
            <div class="flex flex-col space-y-2 mt-4">
              <label
                for="image"
                class="text-slate-700 text-sm text-center shadow-sm font-semibold cursor-pointer max-w-24 border border-slate-300 rounded-lg px-2 py-1 hover:bg-slate-200"
              >
                <input id="image" type="file" multiple @change="handleImageChange" class="hidden" />
                Chọn ảnh
              </label>
            </div>
          </div>
          <div class="flex justify-end mt-4 border-t border-[rgba(242,90,26,0.2)] py-4 space-x-2">
            <button
              v-if="action === 'create'"
              @click="createRoom"
              class="bg-[#f25a1a] text-white px-4 py-2 rounded-lg hover:bg-[#f2371a] min-w-24 flex items-center justify-center"
            >
              <Loading v-if="createLoading" class="w-5 h-5" />
              {{ createLoading ? '' : 'Tạo phòng' }}
            </button>
            <button
              v-if="action === 'update'"
              @click="doUpdateRoom"
              class="bg-[#f25a1a] text-white px-4 py-2 rounded-lg hover:bg-[#f2371a] min-w-24 flex items-center justify-center"
            >
              Cập nhật
            </button>
            <button
              @click="closeDialog"
              class="text-[#f25a1a] px-4 py-2 rounded-lg hover:bg-[rgba(242,90,26,0.1)] border border-[rgba(242,90,26,0.2)] min-w-24"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </Teleport>
</template>

<script setup>
import {
  PlusIcon,
  InformationCircleIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'
import Modal from '@/components/kits/modal/index.vue'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import axios from 'axios'
import Loading from '@/components/icons/loading.vue'
import RoomCell from '@/components/kits/roomCell/index.vue'

const open = ref(false)
const currentRoom = ref(null)
const token = localStorage.getItem('token')
const timeRanges = ref([])
const openTimeRange = ref(false)
const startTime = ref('')
const endTime = ref('')
const roomName = ref('')
const roomDescription = ref('')
const roomPrice = ref({})
const roomAmenity = ref('')
const roomAmenities = ref([])
const rooms = ref([])
const listLoading = ref(false)
const apiBase = import.meta.env.VITE_API_BASE_URL
const apiKey = import.meta.env.VITE_IMAGEBB_API
const roomImages = ref([])
const currentImgIndex = ref(null)
const createLoading = ref(false)
const action = ref('create')

const closeDialog = () => {
  open.value = false
  roomName.value = ''
  roomDescription.value = ''
  roomPrice.value = {}
  roomAmenities.value = []
  roomImages.value = []
  currentRoom.value = null
  openTimeRange.value = false
  startTime.value = ''
  endTime.value = ''
  action.value = 'create'
}

const openDialog = () => {
  open.value = true
}

const resetTimeRange = () => {
  startTime.value = ''
  endTime.value = ''
}

const addTimeRange = () => {
  if (!startTime.value || !endTime.value) {
    toast.error('Vui lòng nhập đầy đủ thông tin')
    return
  }
  timeRanges.value.push({ start: startTime.value, end: endTime.value })
  resetTimeRange()
}

const removeTimeRange = (index) => {
  timeRanges.value.splice(index, 1)
}

const addRoomAmenity = () => {
  if (roomAmenities.value.includes(roomAmenity.value)) {
    toast.error('Tiện ích đã tồn tại')
    return
  }
  if (!roomAmenity.value) {
    toast.error('Vui lòng nhập tiện ích')
    return
  }
  roomAmenities.value.push(roomAmenity.value)
  roomAmenity.value = ''
}

const removeRoomAmenity = (index) => {
  roomAmenities.value.splice(index, 1)
}

const createRoom = async () => {
  createLoading.value = true
  const data = {
    name: roomName.value,
    description: roomDescription.value,
    timeRanges: timeRanges.value,
    amenities: roomAmenities.value,
    images: roomImages.value.map((image) => image.imgUrl),
  }

  console.log(data)
  try {
    const response = await axios.post('https://homestay-be-rv98.onrender.com/api/admin/cms/room/create', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    toast.success('Tạo phòng thành công')
    closeDialog()
    getRooms()
    createLoading.value = false
  } catch (error) {
    console.error(error)
    createLoading.value = false
  }
}

const getRooms = async () => {
  try {
    listLoading.value = true
    const response = await axios.get('https://homestay-be-rv98.onrender.com/api/admin/cms/room', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    rooms.value = response.data.rooms || []
    listLoading.value = false
    console.log(rooms.value)
  } catch (error) {
    console.error(error)
    listLoading.value = false
  }
}

const handleImageChange = async (event) => {
  const files = event.target.files
  roomImages.value = Array.from(files).map((file) => {
    return {
      img: file,
      thumbnail: URL.createObjectURL(file),
      uploading: false,
      uploaded: false,
      imgUrl: '',
    }
  })
}

const uploadImage = async (file, index) => {
  try {
    roomImages.value[index].uploading = true
    currentImgIndex.value = index
    const formData = new FormData()
    formData.append('image', file)
    const response = await axios.post(apiBase, formData, {
      params: {
        key: apiKey,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    roomImages.value[index].thumbnail = response.data.data.url
    roomImages.value[index].uploading = false
    roomImages.value[index].uploaded = true
    roomImages.value[index].imgUrl = response.data.data.url
  } catch (error) {
    console.error(error)
    roomImages.value[index].uploading = false
    roomImages.value[index].uploaded = false
  }
}

const updateRoom = (room) => {
  currentRoom.value = room
  let ret = {}
  action.value = 'update'
  roomName.value = room.name
  roomDescription.value = room.description
  room.timeRanges.map((timeRange) => {
    ret[timeRange.id] = timeRange.price
  })
  roomPrice.value = { ...ret }
  roomAmenities.value = room.amenities
  roomImages.value = room.images
  open.value = true
}

const doUpdateRoom = async () => {
  try {
    const data = {
      name: roomName.value,
      description: roomDescription.value,
      prices: roomPrice.value,
      amenities: roomAmenities.value,
      images: roomImages.value.map((image) => image),
    }
    const response = await axios.put(
      `https://homestay-be-rv98.onrender.com/api/admin/cms/room/${currentRoom.value.id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    toast.success('Cập nhật phòng thành công')
    closeDialog()
    getRooms()
  } catch (error) {
    console.error(error)
  }
}
onMounted(() => {
  getRooms()
})
</script>
