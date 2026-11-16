<template>
    <component :is="iconComponent" v-bind="iconProps" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { IconMap } from '../../icons';

export default defineComponent({
    name: 'Icon',
    props: {
        type: {
            type: String as PropType<keyof typeof IconMap>,
            required: true
        },
        spin: {
            type: Boolean,
            default: false
        },
        rotate: {
            type: Number,
            default: 0
        },
        twoToneColor: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const iconComponent = computed(() => {
            return IconMap[props.type];
        });

        const iconProps = computed(() => ({
            spin: props.spin,
            rotate: props.rotate,
            twoToneColor: props.twoToneColor
        }));

        return {
            iconComponent,
            iconProps
        };
    }
});
</script>
