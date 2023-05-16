<template>
  <label
    v-if="label"
    :for="uuid"
  >
    {{ label }}
  </label>
  <select
    class="field"
    v-bind="{
      ...$attrs,
      onChange: updateValue
    }"
    :value="JSON.stringify(modelValue)"
    :id="uuid"
  >
    <option
      v-for="option in options"
      :value="JSON.stringify(option)"
      :key="JSON.stringify(option)"
    >{{ option }}</option>
  </select>
</template>

<script>
import uniqueId from "../features/uniqueId.js";
import setupFormComponent from "../features/setupFormComponent.js";

export default {
  name: 'XRaySelect',
  props: {
    options: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    modelValue: {
      type: [Array, String, Number]
    }
  },
  data() {
    return {
      useOptions: this.convert()
    }
  },
  methods: {
    convert() {
      let i = 0;
      let useOptions = []
      this.options.forEach(val => {
        useOptions[i] = JSON.stringify(val)
        i++
      })
      return useOptions
    }
  },
  setup (props, context) {
    const uuid = 'x-ray-select-'+uniqueId()

    const { updateValue } = setupFormComponent(props, context)

    return {
      updateValue,
      uuid
    }
  }
}
</script>
