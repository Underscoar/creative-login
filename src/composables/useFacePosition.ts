import { computed, nextTick, ref, watch, type Ref } from 'vue'
import { useTransition } from '@vueuse/core'
import { usePupilPosition } from './usePupilPosition'

export interface Position {
    x: number
    y: number
}

export type CharacterState = 'idle' | 'curious' | 'sad' | 'nervous'

export interface FacePositionOptions {
    characterState: Ref<CharacterState>
    faceConstraints?: Position
    faceCoordinates: Ref<Position>
    faceSpacing?: number
    maxPupilOffset?: number
    maxRotation?: number
    mousePosition: Ref<Position | null>
    pupilSensitivity?: number
    rotationScale?: number
    transformPupils?: Position
}

export function useFacePosition(options: FacePositionOptions) {
    const {
        characterState,
        mousePosition,
        faceCoordinates,
        faceConstraints = { x: 20, y: 20 },
        faceSpacing = 0,
        maxPupilOffset = 4,
        pupilSensitivity = 300,
        maxRotation = 8,
        rotationScale = 200,
        transformPupils,
    } = options

    // Target position - where we want to animate to
    const targetX = ref(faceCoordinates.value.x)
    const targetY = ref(faceCoordinates.value.y)

    // Animated position - uses transition when animating
    const animatedX = useTransition(targetX, {
        duration: 300,
        transition: [0.24, 0.02, 0.02, 0.97],
    })

    const animatedY = useTransition(targetY, {
        duration: 300,
        transition: [0.24, 0.02, 0.02, 0.97],
    })

    // Direct position - follows mouse instantly
    const directX = ref(faceCoordinates.value.x)
    const directY = ref(faceCoordinates.value.y)

    // Whether we're in animation mode (entering/leaving) or direct mode (following mouse)
    const isInAnimationMode = ref(true)

    // Track previous mouse state to detect enter/leave
    const wasMouseInside = ref(false)

    // Watch mouse position and update positions
    watch(
        [mousePosition, characterState],
        ([mouse, state], [, prevState]) => {
            const isMouseInside = state === 'idle' && mouse !== null
            const stateChanged = state !== prevState

            if (state !== 'idle' || mouse === null) {
                // If we were in direct mode, sync the target to current position first
                // so animation starts from where we actually are
                if (!isInAnimationMode.value) {
                    targetX.value = directX.value
                    targetY.value = directY.value
                    isInAnimationMode.value = true

                    // Wait for next tick before setting the center target
                    nextTick(() => {
                        targetX.value = faceCoordinates.value.x
                        targetY.value = faceCoordinates.value.y
                    })
                }
                else {
                    // Already in animation mode, just update target
                    targetX.value = faceCoordinates.value.x
                    targetY.value = faceCoordinates.value.y
                }
            }
            else {
                // Mouse is inside and state is idle
                if (!wasMouseInside.value || stateChanged) {
                    // Just entered - animate to mouse position
                    isInAnimationMode.value = true
                    targetX.value = mouse.x
                    targetY.value = mouse.y

                    // After animation completes, switch to direct mode
                    setTimeout(() => {
                        if (mousePosition.value !== null && characterState.value === 'idle') {
                            isInAnimationMode.value = false
                            directX.value = mousePosition.value.x
                            directY.value = mousePosition.value.y
                        }
                    }, 300)
                }
                else {
                    // Already inside - follow mouse directly
                    directX.value = mouse.x
                    directY.value = mouse.y
                    // Keep target in sync so animation starts from current position when leaving
                    targetX.value = mouse.x
                    targetY.value = mouse.y
                }
            }

            wasMouseInside.value = isMouseInside
        },
        { immediate: true },
    )

    // The effective transitioned position - uses either animated or direct values
    const transitionedX = computed(() => isInAnimationMode.value ? animatedX.value : directX.value)
    const transitionedY = computed(() => isInAnimationMode.value ? animatedY.value : directY.value)

    // Effective mouse position uses transitioned values
    const effectiveMousePosition = computed(() => {
        // When at center, return null to indicate "no mouse"
        const atCenterX = Math.abs(transitionedX.value - faceCoordinates.value.x) < 0.1
        const atCenterY = Math.abs(transitionedY.value - faceCoordinates.value.y) < 0.1

        if (atCenterX && atCenterY && (characterState.value !== 'idle' || mousePosition.value === null)) {
            return null
        }

        return {
            x: transitionedX.value,
            y: transitionedY.value,
        }
    })

    const { pupilPosition: basePupilPosition } = usePupilPosition({
        mousePosition: effectiveMousePosition,
        faceCoordinates,
        maxOffset: maxPupilOffset,
        sensitivity: pupilSensitivity,
    })

    // Target pupil position for transitions
    const targetPupilX = ref(0)
    const targetPupilY = ref(0)

    const animatedPupilX = useTransition(targetPupilX, {
        duration: 300,
        transition: [0.24, 0.02, 0.02, 0.97],
    })

    const animatedPupilY = useTransition(targetPupilY, {
        duration: 300,
        transition: [0.24, 0.02, 0.02, 0.97],
    })

    // Track if we're using transformPupils (for transition)
    const useTransformPupils = ref(false)

    // Update target pupil position based on state
    watch(
        [characterState, basePupilPosition],
        ([state, basePos]) => {
            if (state !== 'idle' && transformPupils) {
                useTransformPupils.value = true
                targetPupilX.value = transformPupils.x
                targetPupilY.value = transformPupils.y
            }
            else {
                useTransformPupils.value = false
                // Keep target in sync so transitions start from correct position
                targetPupilX.value = basePos.x
                targetPupilY.value = basePos.y
            }
        },
        { immediate: true },
    )

    // Use animated values when transitioning, direct values when idle
    const pupilPosition = computed(() => {
        if (useTransformPupils.value) {
            return {
                x: animatedPupilX.value,
                y: animatedPupilY.value,
            }
        }
        return basePupilPosition.value
    })

    const pupilTransform = computed(() => {
        if (useTransformPupils.value) {
            return `translate(${animatedPupilX.value},${animatedPupilY.value})`
        }
        return `translate(${basePupilPosition.value.x},${basePupilPosition.value.y})`
    })

    const isTransitioning = ref(false)
    let transitionTimeout: ReturnType<typeof setTimeout> | null = null

    // Trigger transition when character state changes
    watch(characterState, () => {
        isTransitioning.value = true

        if (transitionTimeout) {
            clearTimeout(transitionTimeout)
        }

        transitionTimeout = setTimeout(() => {
            isTransitioning.value = false
        }, 300)
    })

    const facePosition = computed(() => {
        if (!effectiveMousePosition.value) {
            return faceCoordinates.value
        }

        const clamp = (value: number, min: number, max: number) =>
            Math.max(min, Math.min(max, value))

        const offsetX = effectiveMousePosition.value.x - faceCoordinates.value.x
        const offsetY = effectiveMousePosition.value.y - faceCoordinates.value.y

        const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)

        const maxDistance = 5000
        const scale = Math.min(1, Math.sqrt(distance / maxDistance))

        const scaledOffsetX = offsetX * scale
        const scaledOffsetY = offsetY * scale

        return {
            x: clamp(
                faceCoordinates.value.x + scaledOffsetX,
                faceCoordinates.value.x - faceConstraints.x,
                faceCoordinates.value.x + faceConstraints.x,
            ),
            y: clamp(
                faceCoordinates.value.y + scaledOffsetY,
                faceCoordinates.value.y - faceConstraints.y,
                faceCoordinates.value.y + faceConstraints.y,
            ),
        }
    })

    const faceRotation = computed(() => {
        if (!effectiveMousePosition.value) {
            return 0
        }

        const offsetX = effectiveMousePosition.value.x - faceCoordinates.value.x
        return (offsetX / rotationScale) * maxRotation * -1
    })

    const faceCenterX = faceSpacing / 2

    const faceTransform = computed(
        () => `translate(${facePosition.value.x},${facePosition.value.y}) rotate(${faceRotation.value}, ${faceCenterX}, 0)`,
    )

    return {
        isTransitioning,
        facePosition,
        faceRotation,
        faceTransform,
        pupilPosition,
        pupilTransform,
    }
}
