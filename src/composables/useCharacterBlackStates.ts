import { computed } from 'vue'

export function useCharacterBlackStates() {
    const frameOptions = computed(() => ({
        width: 660,
        height: 800,
        floor: 618,
    }))

    const basePosition = computed(() => ({
        left: 343,
    }))

    // NOTE: Anchor of the face is the center of the left (character's right) eye
    const faceOptions = computed(() => ({
        eyeRadius: 8,
        pupilRadius: 4,
        spacing: 30,
    }))

    const idle = computed(() => {
        const height = 263
        const width = 107
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2)
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: true,
            skew: 0,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
        }
    })

    const idlePoints = computed(() => {
        const top = frameOptions.value.floor - idle.value.height
        const right = basePosition.value.left + idle.value.width
        return [
            { x: basePosition.value.left, y: top },
            { x: basePosition.value.left, y: frameOptions.value.floor },
            { x: right, y: frameOptions.value.floor },
            { x: right, y: top },
        ]
    })

    const skewed = computed(() => {
        const skewAmount = 30

        const height = 263
        const width = 107
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2) + skewAmount
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: false,
            skew: skewAmount,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
        }
    })

    const skewedPoints = computed(() => {
        const top = frameOptions.value.floor - skewed.value.height
        const right = basePosition.value.left + skewed.value.width
        return [
            { x: basePosition.value.left + skewed.value.skew, y: top },
            { x: basePosition.value.left, y: frameOptions.value.floor },
            { x: right, y: frameOptions.value.floor },
            { x: right + skewed.value.skew, y: top },
        ]
    })

    const sad = computed(() => {
        const height = 150
        const width = 107
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2)
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: false,
            skew: 0,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
        }
    })

    const sadPoints = computed(() => {
        const top = frameOptions.value.floor - sad.value.height
        const right = basePosition.value.left + sad.value.width
        return [
            { x: basePosition.value.left, y: top },
            { x: basePosition.value.left, y: frameOptions.value.floor },
            { x: right, y: frameOptions.value.floor },
            { x: right, y: top },
        ]
    })

    const nervous = computed(() => {
        const height = 263
        const width = 107
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2) - 20
        const centerOfFaceYCoordinate = anchorPosition.y + 150

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: false,
            skew: 0,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
        }
    })

    const nervousPoints = computed(() => {
        const top = frameOptions.value.floor - nervous.value.height
        const right = basePosition.value.left + nervous.value.width
        return [
            { x: basePosition.value.left, y: top },
            { x: basePosition.value.left, y: frameOptions.value.floor },
            { x: right, y: frameOptions.value.floor },
            { x: right, y: top },
        ]
    })

    function getTopLeftAnchorCoordinates(height: number) {
        const x = basePosition.value.left
        const y = frameOptions.value.floor - height

        return { x, y }
    }

    return {
        basePosition,
        faceOptions,
        idle,
        idlePoints,
        skewed,
        skewedPoints,
        sad,
        sadPoints,
        nervous,
        nervousPoints,
    }
}
