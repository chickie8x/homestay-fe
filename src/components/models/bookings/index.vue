<template>
  <div class="w-full h-full p-8">
    <div class="pb-2 flex justify-between border-b border-[rgba(242,90,26,0.2)]">
      <span class="font-[Coiny] text-2xl text-[#f25a1a]">Quản lý Booking</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { PlusIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/kits/modal/index.vue'
import Loading from '@/components/icons/loading.vue'
import { toast } from 'vue-sonner'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'

const token = localStorage.getItem('token')
const open = ref(false)
const loading = ref(false)
const listLoading = ref(false)
const deleteLoading = ref(false)
const editLoading = ref(false)
const currSelect = ref(null)
const action = ref('create')
const startTime = ref('')
const endTime = ref('')

const openDialog = () => {
  open.value = true
}

const closeDialog = () => {
  open.value = false
  startTime.value = ''
  endTime.value = ''
  currSelect.value = null
  action.value = 'create'
}

const fetchData = async () => {}

const handleDelete = async (item) => {
  deleteLoading.value = true
  currSelect.value = item
  console.log(item)
  await axios
    .delete(`https://homestay-be-rv98.onrender.com/api/admin/cms/time-range/${item.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(() => {
      timeRanges.value = timeRanges.value.filter((timeRange) => timeRange.id !== item.id)
      deleteLoading.value = false
      toast.success('Đã xoá')
      currSelect.value = null
    })
    .catch((error) => {
      console.error(error)
      deleteLoading.value = false
      toast.error(`${error.response?.data?.message || 'Đã có lỗi xảy ra'}`)
    })
}

onMounted(() => {
  fetchData()
})
</script>
