<template>
  <span
      :id="id"
      class="vue-dd-primitive"
      @click.prevent="$emit('openParent')">
    <span
        v-if="parentOpen && saveFocus"
        ref="focusElement"
        class="vue-dd-focus vue-dd-icon-eye"
        @click.prevent="focusEmit"
        @mouseenter="hover=true"
        @mouseup="hover=false"
        @mouseleave="hover=false"
        :class="{
        'vue-dd-focus-hover': hover,
        'vue-dd-focus-selected': isFocused
      }"
    ></span>
    <span
        v-if="showName"
        :class="{
          'vue-dd-key': true,
          'vue-dd-key-of-array': parentIsArray,
        }">{{ name }}</span><span class="vue-dd-colon">:</span>
    <span v-if="type === 'null'"
          class="vue-dd-null">null</span>
    <span v-else-if="type === 'undefined'"
          class="vue-dd-undefined">undefined</span>
    <span v-else-if="type === 'number'"
          class="vue-dd-number">{{ modelValue }}</span>
    <span v-else-if="type === 'bigint'"
          class="vue-dd-bigint">{{ modelValue }}</span>
    <span v-else-if="type === 'string'"
          class="vue-dd-string">"{{ escapeQuotesFn(modelValue) }}"</span>
    <span v-else-if="type === 'boolean'"
          class="vue-dd-boolean"
          :class="{'vue-dd-false':!modelValue}">{{ modelValue }}</span>
    <span v-else-if="type === 'symbol'"
          class="vue-dd-symbol">{{ modelValue.toString() }}</span>
    <span v-else
          class="vue-dd-unknown">[unknown_type]{{ modelValue }}</span>
    <span class="vue-dd-comma" v-if="shouldComma">,</span>
  </span>
</template>
<script>
export default {
  name: 'NodePrimitive',
  inheritAttrs: false,
  emits: ['openParent', 'show', 'focus'],
  props: [
    // ref
    'root',
    'rootId',
    // options
    'modelValue',
    'name',
    'escapeQuotes',
    'save',
    'saveFocus',
    'focus',
    'delimiter',
    // helpers
    'parentOpen',
    'pointer',
    'type',
    'parentType',
    'size',
    'position',
    'expanded',
    // functions
    'escapeQuotesFn',
    'emitFn'
  ],
  data () {
    return {
      id: this.makeId(),
      hover: false,
    }
  },
  methods: {
    showEmit () {
      this.emit('show', {
        pointer: this.pointer,
        pointerElement: this.$refs.focusElement,
        type: 'primitive'
      })
      return true
    },
    focusEmit () {
      this.emit('focus', {
        pointer: this.pointer,
        focusElement: this.$refs.focusElement
      })
    },
    emit (name, ...args) {
      this.emitFn(this, name, ...args)
    },
    makeId () {
      const pointer = this.pointer !== '' ? `${this.delimiter}${this.pointer}` : ``
      return `_${this.rootId}${pointer}`
    }
  },
  mounted () {
    this.showEmit()
  },
  computed: {
    parentIsArray () {
      return this.parentType === 'array'
    },
    nameString () {
      return String(this.name)
    },
    showName () {
      return (!this.parentIsArray && this.nameString)
          // show array index when the arrays are open
          || (this.parentIsArray && this.parentOpen)
    },
    shouldComma () {
      return this.size && this.position && this.position !== this.size
    },
    isFocused () {
      return String(this.pointer) === String(this.focus)
    }
  }
}
</script>
