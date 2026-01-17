<template>
    <div class="page-wrap">
        <div ref="contentWrap" class="content-wrap">
            <GraphicsWrap :mouse-position="mousePosition" />
            <LoginFormWrap :mouse-position="mousePosition" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GraphicsWrap from './components/GraphicsWrap.vue'
import LoginFormWrap from './components/LoginFormWrap.vue'
import { useMouseInElement } from '@vueuse/core'

const contentWrap = ref<HTMLElement | null>(null)
const { elementX, elementY, isOutside } = useMouseInElement(contentWrap)

const mousePosition = computed(() =>
    isOutside.value ? null : { x: elementX.value, y: elementY.value },
)
</script>

<style lang="scss" scoped>
.page-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-wrap {
    background: #ececec;
    max-width: 1100px;
    flex-grow: 1;
    margin: auto;
    display: flex;
    border-radius: 20px;
}
</style>
