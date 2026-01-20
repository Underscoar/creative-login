import { computed } from 'vue'

export function useCharacterPurpleStates() {
    const frameOptions = computed(() => ({
        width: 660,
        height: 800,
        floor: 618,
    }))

    const basePosition = computed(() => ({
        left: 250,
    }))

    // NOTE: Anchor of the face is the center of the left (character's right) eye
    const faceOptions = computed(() => ({
        eyeRadius: 6,
        pupilRadius: 3,
        spacing: 45,
    }))

    const characterOptions = computed(() => ({
        kinkLeftOffset: 140,
        kinkRightOffset: 120,
    }))

    const idle = computed(() => {
        const height = 360
        const width = 150
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
            transformPupils: {
                x: 0,
                y: 0,
            },
            faceRotation: 0,
        }
    })

    const idlePoints = computed(() => {
        const top = frameOptions.value.floor - idle.value.height
        const right = basePosition.value.left + idle.value.width

        return [
            { x: basePosition.value.left, y: top }, // Top left
            { x: basePosition.value.left, y: top + characterOptions.value.kinkLeftOffset }, // Kink left
            { x: basePosition.value.left, y: frameOptions.value.floor }, // Bottom left
            { x: right, y: frameOptions.value.floor }, // Bottom right
            { x: right, y: top + characterOptions.value.kinkRightOffset }, // Kink right
            { x: right, y: top }, // Top right
        ]
    })

    const skewed = computed(() => {
        const skewAmount = 50

        const height = 360
        const width = 150
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2) + skewAmount + 30
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius)
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius

        return {
            width: width,
            height: height,
            allowMouseFollow: true,
            skew: skewAmount,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
            transformPupils: {
                x: 2,
                y: 0,
            },
            faceRotation: 0,
        }
    })

    const skewedPoints = computed(() => {
        const top = frameOptions.value.floor - skewed.value.height
        const right = basePosition.value.left + skewed.value.width
        return [
            { x: basePosition.value.left + skewed.value.skew, y: top }, // Top left
            { x: basePosition.value.left + skewed.value.skew - 20, y: top + characterOptions.value.kinkLeftOffset }, // Kink left
            { x: basePosition.value.left, y: frameOptions.value.floor }, // Bottom left
            { x: right, y: frameOptions.value.floor }, // Bottom right
            { x: right + skewed.value.skew - 15, y: top + characterOptions.value.kinkRightOffset }, // Kink right
            { x: right + skewed.value.skew, y: top }, // Top right
        ]
    })

    const sad = computed(() => {
        const skewAmount = -50
        const height = 360
        const width = 150
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2)
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius) - 20
        const facePositionY = centerOfFaceYCoordinate - faceOptions.value.eyeRadius + 30

        return {
            width: width,
            height: height,
            allowMouseFollow: true,
            skew: skewAmount,
            centerOfFaceCoordinates: {
                x: centerOfFaceXCoordinate,
                y: centerOfFaceYCoordinate,
            },
            faceCoordinates: {
                x: facePositionX,
                y: facePositionY,
            },
            transformPupils: {
                x: 2.5,
                y: -1,
            },
            faceRotation: 20,
        }
    })

    const sadPoints = computed(() => {
        const top = frameOptions.value.floor - idle.value.height
        const right = basePosition.value.left + idle.value.width

        return [
            { x: basePosition.value.left, y: top }, // Top left
            { x: basePosition.value.left + sad.value.skew, y: top + characterOptions.value.kinkLeftOffset }, // Kink left
            { x: basePosition.value.left, y: frameOptions.value.floor }, // Bottom left
            { x: right, y: frameOptions.value.floor }, // Bottom right
            { x: right + sad.value.skew, y: top + characterOptions.value.kinkRightOffset }, // Kink right
            { x: right - 20, y: top - sad.value.skew }, // Top right
        ]
    })

    const nervous = computed(() => {
        const height = 360
        const width = 150
        const faceWidth = (faceOptions.value.eyeRadius * 2) + faceOptions.value.spacing
        const anchorPosition = getTopLeftAnchorCoordinates(height)

        const centerOfFaceXCoordinate = anchorPosition.x + (width / 2)
        const centerOfFaceYCoordinate = anchorPosition.y + 40

        const facePositionX = centerOfFaceXCoordinate - ((faceWidth / 2) - faceOptions.value.eyeRadius) - 30
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
            transformPupils: {
                x: 3,
                y: 0,
            },
            faceRotation: 0,
        }
    })

    const nervousPoints = computed(() => {
        const top = frameOptions.value.floor - nervous.value.height
        const right = basePosition.value.left + nervous.value.width

        return [
            { x: basePosition.value.left, y: top }, // Top left
            { x: basePosition.value.left, y: top + characterOptions.value.kinkLeftOffset }, // Kink left
            { x: basePosition.value.left, y: frameOptions.value.floor }, // Bottom left
            { x: right, y: frameOptions.value.floor }, // Bottom right
            { x: right, y: top + characterOptions.value.kinkRightOffset }, // Kink right
            { x: right, y: top }, // Top right
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
