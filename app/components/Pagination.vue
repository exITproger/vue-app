<script setup lang="ts">
const props = defineProps<{
  page: number
  total: number
  perPage: number
}>()

const emit = defineEmits<{ 'update:page': [value: number] }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))

const pages = computed(() => {
  const t = totalPages.value
  const c = props.page
  const arr: (number | '...')[] = []
  if (t <= 7) {
    for (let i = 1; i <= t; i++) arr.push(i)
    return arr
  }
  arr.push(1)
  if (c > 4) arr.push('...')
  for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) arr.push(i)
  if (c < t - 3) arr.push('...')
  arr.push(t)
  return arr
})

const go = (p: number) => {
  if (p < 1 || p > totalPages.value || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 flex-wrap">
    <UButton
      icon="i-heroicons-chevron-left"
      variant="ghost"
      color="neutral"
      :disabled="page === 1"
      @click="go(page - 1)"
    />
    <template v-for="(p, idx) in pages" :key="idx">
      <span v-if="p === '...'" class="px-2 text-gray-400">…</span>
      <UButton
        v-else
        :label="String(p)"
        :variant="p === page ? 'solid' : 'ghost'"
        :color="p === page ? 'primary' : 'neutral'"
        @click="go(p as number)"
      />
    </template>
    <UButton
      icon="i-heroicons-chevron-right"
      variant="ghost"
      color="neutral"
      :disabled="page === totalPages"
      @click="go(page + 1)"
    />
  </div>
</template>