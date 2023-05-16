<template>
  <label class="switch">
    <input
      v-bind="{ ...$attrs, onChange: updateValue }"
      :checked="modelValue"
      :id="uuid"
      type="checkbox"
      class="field"
    />
    <span class="slider round"></span>
    </label>
  <label
      :for="uuid"
      v-if="label"
    >
    {{ label }}
  </label>
</template>

<script>
import uniqueId from '../features/uniqueId.js'
import setupFormComponent from '../features/setupFormComponent.js'

export default {
  name: 'XRayCheckbox',
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: Boolean
    }
  },
  emits: ['update:modelValue'],
  setup (props, context) {
    const uuid = 'x-ray-checkbox'+uniqueId()

    const { updateValue } = setupFormComponent(props, context)

    return {
      updateValue,
      uuid
    }
  }
}
</script>
<style>
/* The switch - the box around the slider */
.x-ray-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.x-ray-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.x-ray-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.x-ray-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .x-ray-slider {
  background-color: #2196F3;
}

input:focus + .x-ray-slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .x-ray-slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.x-ray-slider.round {
  border-radius: 34px;
}

.x-ray-slider.round:before {
  border-radius: 50%;
}
</style>
