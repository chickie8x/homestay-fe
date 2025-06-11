<template>
  <div
    class="w-full h-screen overflow-auto flex flex-col bg-[rgb(247,242,215)] relative"
    :class="route.name === 'admin-dashboard' || route.name === 'payment' ? 'pb-0' : 'pb-18'"
  >
    <header
      :class="route.name === 'admin-dashboard' ? 'hidden' : 'block'"
      class="bg-background/75 backdrop-blur bg-white/[.75] h-16 py-2 flex justify-center items-center border-b border-[#CD6B58]"
    >
      <Name />
    </header>
    <div class="w-full flex-1">
      <router-view />
    </div>
    <div
      v-if="route.name !== 'admin-dashboard' && route.name !== 'payment'"
      class="fixed z-50 bottom-0 w-full h-18 px-32 flex items-center border-t border-[#f25a1a] bg-[rgb(247,242,215)]"
    >
      <div v-if="cost > 0" class="flex flex-col justify-center space-x-2 mr-auto">
        <div>
          <span class="font-[Coiny] text-xl text-[#f25a1a]">Tổng đơn:</span>
          <span class="text-[#f25a1a] font-[Coiny] text-xl">{{ currencyFormat(totalCost) }}</span>
        </div>
        <div>
          <span class="text-[#f25a1a] text-sm">{{ `Giảm giá ${discountPercentage}% - Gốc ${currencyFormat(cost)}` }}</span>
        </div>
      </div>
      <button
        @click="placeOrder"
        class="text-[#f25a1a] text-2xl font-[Coiny] border border-[#f25a1a] px-2 py-1 rounded-lg ml-auto cursor-pointer hover:bg-[#f2371a] hover:text-white"
        :class="isBooked ? 'bg-[#f25a1a] text-white' : ''"
      >
        Đặt phòng
      </button>
    </div>
    <footer
      :class="[route.name === 'admin-dashboard' ? 'hidden' : 'block']"
      class="bg-[rgb(34,34,34)] py-10"
    >
      <div class="w-full h-full flex flex-col justify-center items-center space-y-4">
        <Name color="#f7f2d7" />
        <span class="font-[Coiny] text-xl text-[#f7f2d7]">Home away from home</span>
        <div class="flex justify-center items-center space-x-5">
          <a href=""
            ><img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAApZJREFUWAm9mNGR2yAQhikhHSQlXAku4UpwCdeBr4NzB04HTgcpwQ83EjzFJTDASSh5cebnhE6WhMUKJM8wyBKCT/8uywJjC3/GvO9qVb40Wpyt4tdaC2k1v6HgulHigmeVKl7RduEwtNdu8vLNGn7ow3ioiPpqNT9ZyX/QRo1oDbDGiLcICKdgRLt8oJUunxcqNgd7tbrYR+gTbpJZtWlgww9hgsAT52vwl9bpN6hPGDOAM77tnHk7OK/saUwyceev4YdcitVKSISgrsx8dG3E2wTS160PXeyT4RATVfkSCie4X6nyZ2icSpbPX0S9K7xoNUes8pKT61qVxxhfQvAOjdNoISf7yOB3cT7EGHsECHA872nHWKseWbFOBfgZYYWYAxypuKV6UGYOcKRiqu9htbkzSfsHqrbB/rfVvF9mfR0qum6sed91plo4QT5k8TQJmDjpjOQ75kLCQjD/YTf75/sQMMeHg401ujz7gZbWawFibrDaiMtSMP/eioBXliOVWgvQTRSvQkq9FiCYGBVsFOWHs2PmP3VSkk2cAfAYK4o38WzQ7HeYCtgG7KhltVbiQg4zGQCjBalV+YvZB6lPXzl/nQIosW0lLApuLCs5aamrtTgjse2XyfyNMQagfjvqBHFLHTpJjYVTYQaTOSWN65IFdIRMmCL9sO0agG6Z8yGLauZNAIcJMGX6bwA43j6k+Et2Ew/V60xNDDleyZyAleL3GyYP5+slps4FiDNFzxGsnamxSyME1CyAlJ0hFTIZkALnpaVApgDCrBjLj0uuY4L4UsDYo5JZ6H+yeHInVAG/JAN+mjT/wbrVHKdf2IDf5XPRgABT/DWUXMwqFdvA+afme2Q2UPYh4Odx3BHLaWz//Xb/AbywlWxQ8y1NAAAAAElFTkSuQmCC"
              alt="La Maison"
          /></a>

          <a href="">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAxFJREFUWAm9md+R2yAQxlVCSkgJV4JLuA7iDpIO7jq4dODrwOnAJfjhxoI8uQQN6A+6vDjzYSEjeRGLJJ9nPNZIiP2xu3wsOMtmfsryY9Oo/Fer5d4ocW60LIwWF3xx3Sp5xLNanV7RdqaZtNcuxfGbKcWLD+OgGL9no8XOFOJ7mlVGa4C1pXxjQFgPMtqtB9pW8udMj8Vgz0aftgz/hJus7DUSuCnlW5gg8MTmmhYHRqhIo6nvYULBZgDn/nZbymOqkRXaH+5JiDtfEdbQYKLhrvRpG3qZex/hsnICSdFilzrBoK2E37IM+mS0gFYtyisIs2+gVvl7Sp+tlgWZj92oF8EBZAwIj6QAou1dqDvvLYajAAusPio9MgMvruU9ChDhrorTU2ouDiKxRu65MA469pIRUWp1vnftYr/IRfu6KT82scYpz0OAjtWmUyFYNstCbDJ0mAIQaxsD7EEZamElJ8XtMTg8HwNa4SdKLE5fjcr/ZM38Ze2AEdZF/myuIbMaOgY0tzV9V+v8uapOT/AiBxBzI0udXVYykBujjwOZAEyWMTtRmCO5dg49I8LVecRWP2sCgo3r6itgAO6hgAkh3vlRtTWjtz9x/azpQRdiVoFgNckjDK0+awI2Sh4zrsx4bK7yIZN+XUDIDLPaGABOrD5rAtq+Og0jveHPcL+6QIXics5vg2tonT+YBTp76dMqZMw33jfurLeE52sl3n24RWWcEue+L8Nbj+82NUaLbaPl3n6JUv2zFC/+IBOvb6phi0rG4v2v+vujH1XkAt7jRCYIPdbcRuW/g407eOjSONQUZxdalnwFbN685wxMJT7RCXm2MhZv4r3oZOzWevqAiUr8iBGsv3Z7iaO2RSG9pdj0eQ0n1BHouJduMIO2sO0iOvnrSqdHgVD9YsM/CeU/tPl4PSEYjJDqeKV7B38h8Fkmr78i3OywhkghxnM23jHPNkoWdlMUMpxyH7qWesYyBQivzQppDLoHnXGUAY8ZJV4fAkaBowpCOXRdh+XRAnTy0cHgr4m9LeeITRbVJ3XvPwEYzF2VqKa4AAAAAElFTkSuQmCC"
              alt="La Maison"
            />
          </a>

          <a href="">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAABPFJREFUWAm9md1vFFUUwOdP8E8wbelqzNpNFLFSpBqIWAnqiybw0thSgzzYFqEPQtuIQT66LSDKh6FQAa0hoWAwpFSyNTURA7qStjtjWlz6UKISXWcWZvbtmHO6d7xz996Z2WXcJpt7936c85tzzpxz91bTKvzL56ebbTPTWbCMMcfUs7Zl5BxLB/xgv2AaaZx7YM7249oK1ZS3DXLpR5y83sfDMKgQbdax9FNOTn+0PK0hViNYIW8MhYAgC4ZYFx1o4b7xboUWC4LNOtZsawj7qJdEbDUpsJ03htQEihmKNUtPhXCVVGm5+/CFQp0KnNLhQt5Il6skgvWpUhLJSDXcqnqYQHfft2Zb+c3GzDV4841XIR5/Ampqajyfnu3vwG1jsuzPTHoc/ly8Cffu/iQND8ytErtpGuYnx9IxV9HGeWMSGhuf8UAhZCxWDyPDSalwtjdM+8fiTQIV1xYsIyeNR0qiRTjctOfDnhI4BLx04bOHhmNQt43vpLJKXF20nmdxd2dHCeBQstezhimqtEUvqfZ6rChaDzeJgM+valQKUykJGvcDxBruxiIfe0yoCDhx5WxVATEWCdDJTzczKL7lAZuavNb76/c03JmfguzcFCzMfw+2mZHCnz6ZhBs/fC2dQ11+FsT5fE5v1tCUPBjr84DtbRs9Sta3rPXEJ6Yito9vcRzl8GN8PwiQUk7Byozxm1ifB0we2OVRgnkMc+CRQ7sJ9Nznh+DuwnXo29VFQIMHemHy2leUQ1HOP/duwcD+ndDRvgm+PPuxKysE4EXNVpQ1HvCLM4ddoewBUPizK56G/Xvfp7lVTY2AobC5bSNBd3d1uIAoa/nyp2Bz2yaaO370I9oTBIjvhqY6SvGAI8ODHkC0IAK90NxE41gVMEeOFq2z7qUXyZLMxSufWwFDyT5au3VLK7S/tRQyQYD0ojCLiC0PiK7j53ds2wL19fVw5PBuuHD+OHw7fg4SDXHo2b4VLl8aptKI+xng+lfWwuuvtdAcPti2rrdJXhAg6tR4xXyfBxRfgtWrV5LFWH3GHDlyMgm1tbXw+GMxcjXGIbp7cKAXfv7xMo3herQuA2Mtr1fsh3IxCka3ipvF7/m/p33X/fart7QFATIXuwcEXiFvQQQc2LczEJDfH6YfBGibRloLk2YQsK6uDtI3vokUMhgwc1HDZCh7WtGCCImxF8bVMnmysSBAqsdOTg8sdQjHPi0vr1GWNhmEamxx4Toc/WSPr0eo1GFBluVCmQWXXF370FacvXWV8ijqUD0A3lb8d5qR1GMV4Ilje9VCuQOvTDGGR39vt+sNX0BLP+UC5vBKQxAuAiYST0JqYpTgUNHVK2eo9m7YsA66Ojvg/OinMPPLeAm8Pj0BJ47to6TNwoS1voDiFYltZg7ykB/0v+c+KRO4bFkd/SZh31VtQ0McEol4yX5xPX9w4HXjAdq1HuugFflYvDM3ReVLFBrVdzxYSN9iU88qL5gKQsqZ01PkGixhUYHFYjGSKYVbCjP/+xrR1YLpS2IsynnUzTzq2zpVvJdhD4j3M75Q/CTFo1nV+5mU52cmD+PXr4a7Q7tVBepYeitmdeaKqFrbNHLKexgVjGocX/sHZuZ0dHCZgxW5VAXIxl3QCiyKFnNMvf9/AWOAfIunIDwO2ZYxhgdLAiiWyyIM/mtijI5z+AO8wr9/ARkJtotTKbX1AAAAAElFTkSuQmCC"
              alt="La Maison"
            />
          </a>
        </div>
      </div>
      <button @click="console.log(bookingStore.getBooking)">Clear</button>
    </footer>
  </div>
  <Toaster rich-colors position="top-center" />
  <Modal :open="isModalOpen" class="z-50">
    <PlaceOrder @close="isModalOpen = false" />
  </Modal>
</template>

<script setup>
import Name from '@/components/icons/name.vue'
import { Toaster } from 'vue-sonner'
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'
import { currencyFormat, discountPercentageCalc } from '@/utils'
import { useBookingStore } from '@/stores'
import axios from 'axios'
import { toast } from 'vue-sonner'
import Modal from '@/components/kits/modal/index.vue'
import PlaceOrder from '@/components/kits/modal/place-order/index.vue'

const bookingStore = useBookingStore()

const route = useRoute()
const isBooked = computed(() => bookingStore.getBooking.timeRange.length > 0)
const cost = computed(() =>
  bookingStore.getBooking.timeRange.reduce((acc, timeRange) => acc + timeRange.price, 0),
)

const discountPercentage = computed(() => {
  return discountPercentageCalc(bookingStore.getBooking.timeRange)
})

const totalCost = computed(() => {
  return cost.value - (cost.value * discountPercentage.value) / 100
})

const isModalOpen = ref(false)
const placeOrder = () => {
  if (!isBooked.value) {
    toast.error('Vui lòng chọn phòng')
    return
  }

  isModalOpen.value = true
}
</script>
