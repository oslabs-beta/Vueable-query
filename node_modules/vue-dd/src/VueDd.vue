<template>
  <div
      ref="root"
      :id="rootId"
      :class="['vue-dd', {
      'vue-dd-inline': inline,
      'vue-dd-open': openClass,
      'vue-dd-dark': dark,
      'vue-dd-no-arrow': !arrow,
    }, $attrs.class]"
      :style="[cssVars, $attrs.style]">
    <node-primitive
      v-if="primitive"

      :root="$refs.root"
      :rootId="rootId"

      :modelValue="modelValue"
      :name="name"
      :focus="useFocus"
      :escapeQuotes="escapeQuotes"
      :save="save"
      :saveFocus="useSaveFocus"
      :delimiter="delimiter"

      pointer=""
      :type="type"
      :parentOpen="false"
      parentType=""

      :escapeQuotesFn="escapeQuotesFn"
      :emitFn="emitFn"

      @focus="focusEmit"
      @show="showEmit"
    />
    <node-complex
      v-else

      ref="nodeComplex"
      :root="$refs.root"
      :rootId="rootId"

      :modelValue="modelValue"
      :name="name"
      :openLevel="useOpenLevel"
      :openSpecific="useOpenSpecific"
      :focus="useFocus"
      :escapeQuotes="escapeQuotes"
      :startClosed="startClosed"
      :longText="longText"
      :preview="preview"
      :previewInitial="previewInitial"
      :deep="isRef ? true : deep"
      :watch="watch"
      :save="save"
      :saveFocus="useSaveFocus"
      :arrow="arrow"
      :arrowOpen="arrowOpen"
      :arrowClosed="arrowClosed"
      :delimiter="delimiter"
      :more="more"

      pointer=""
      :type="type"
      parentType=""
      :parentOpen="false"
      :shared="shared"

      :getTypeFn="getTypeFn"
      :isPrimitiveFn="isPrimitiveFn"
      :escapeQuotesFn="escapeQuotesFn"
      :unwrapSpecificFn="unwrapSpecificFn"
      :emitFn="emitFn"

      @show="showEmit"
      @toggle="toggleEmit"
      @open="openEmit"
      @focus="focusEmit"
      @forget="forgetEmit"
    />
  </div>
</template>
<script lang="ts">
// @ts-nocheck
import NodeComplex from "./NodeComplex.vue";
import NodePrimitive from "./NodePrimitive.vue";
import { isRef, defineComponent } from "vue";
import { isObject, makeId } from "./helpers.js";

// this is important
let unwrapCache = {}

export default defineComponent({
  name: 'VueDd',
  inheritAttrs: false,
  emits: ['open', 'toggle', 'focus', 'show'],
  props: {
    // main options
    modelValue: { type: undefined, required: true },
    id: { type: [String, Number], default: '' },
    name: { type: String, default: '' },
    openLevel: { type: [Number, String, Array], default: 0 },
    openSpecific: { type: Array, default: () => [] },
    startClosed: { type: Boolean, default: false },
    focus: { type: [String, Number], default: null },
    focusSticky: { type: Boolean, default: false },
    focusOffsetX: { type: Number, default: -35 },
    focusOffsetY: { type: Number, default: -15 },
    focusDelay: { type: Number, default: 150 },
    preview: { type: [Number, Boolean], default: 5 },
    previewInitial: { type: Boolean, default: true },
    escapeQuotes: { type: Boolean, default: false },
    longText: { type: Number, default: 50 },
    delimiter: { type: String, default: '.' },
    more: { type: String, default: '...' },
    // styling options
    arrow: { type: Boolean, default: true },
    arrowOpen: { type: String, default: '&#x25BC;' },
    arrowClosed: { type: String, default: '&#x25BC;' },
    inline: { type: Boolean, default: true },
    dark: { type: Boolean, default: true },
    fontFamily: { type: String, default: '"JetBrains Mono", "Courier", serif' },
    fontSize: { type: String, default: '.7rem' },
    lineHeight: { type: String, default: '1rem' },
    paddingLeft: { type: String, default: '.7rem' },
    maxHeight: { type: String, default: '500px' },
    maxWidth: { type: String, default: '100%' },
    // save
    save: { type: Boolean, default: false },
    saveFocus: { type: Boolean, default: true },
    storage: { type: String, default: 'local' }, // session | local
    // watch options
    watch: { type: Boolean, default: true },
    deep: { type: Boolean, default: true },
  },
  data () {
    return {
      rootId: makeId(this.id, this.name, window),
      openClass: false,
      css: this.class,
      useOpenSpecific: this.openSpecific,
      // if openLevel is string, convert to number int
      memory: null,
      shared: {
        hiddenPointers: {} // must be defined as empty
      },
      setFocusAlready: false,
      useFocus: null,
      // saveFocus only works, if you supply an id or a name for the object
      useSaveFocus: !this.id && !this.name ? false : this.saveFocus
    }
  },
  created () {
    if (this.save || this.useSaveFocus) {
      // this is very important for save functionality
      this.initMemory();
    }
    this.useFocus = this.getFocus()
    this.useOpenSpecific = this.getOpenSpecific()
  },
  mounted () {},
  computed: {
    useOpenLevel () {
      return typeof this.openLevel === 'string' ? parseInt(this.openLevel) : this.openLevel
    },
    cssVars () {
      return {
        '--vue-dd-fontFamily': this.fontFamily,
        '--vue-dd-fontSize': this.fontSize,
        '--vue-dd-lineHeight': this.lineHeight,
        '--vue-dd-paddingLeft': this.paddingLeft,
        '--vue-dd-maxHeight': this.maxHeight,
        '--vue-dd-maxWidth': this.maxWidth,
      }
    },
    unwrapSpecific () {
      return this.unwrapSpecificFn(this.openSpecific)
    },
    type () {
      return this.getTypeFn(this.modelValue)
    },
    primitive () {
      return this.isPrimitiveFn(this.type)
    },
    isSet () {
      return this.type === 'object' && this.modelValue instanceof Set
    },
    isRef () {
      return isRef(this.modelValue)
    },
  },
  methods: {
    forgetEmit () {
      if (this.save && typeof this.memory === 'object') {
        this.memory.open = {}
        this.shared.hiddenPointers = {}
        this.useOpenSpecific = this.baseOpenSpecific()
        this.store().set(this.memory)
      }
    },
    setFocus () {

      if (this.useSaveFocus && this.useFocus !== null) {

        let focus = true;
        if (this.setFocusAlready) focus = false
        if (this.focusSticky) focus = true

        if (focus) {

          setTimeout( () => {

            const pointerEl = this.getElement(this.useFocus)

            if (pointerEl) {

              this.$refs.root.scrollLeft = pointerEl.offsetLeft + this.focusOffsetX
              // setting scrollLeft and scrollTop at the same time
              // does not work in browsers right now
              // console.log('pointerEl', pointerEl.offsetTop)
              this.$refs.root.scrollTop = pointerEl.offsetTop + this.focusOffsetY

              pointerEl.classList.add('vue-dd-highlight')
              setTimeout(() => pointerEl.classList.remove('vue-dd-highlight'), 500)

              this.setFocusAlready = true
            }
          }, this.focusDelay)
        }
      }
    },
    getElement (pointer) {
      pointer = pointer === '' ? '' : `${this.delimiter}${pointer}`
      const elId = `_${this.rootId}${pointer}`
      return document.getElementById(elId)
    },
    getFocus () {
      let focus = this.focus
      if (this.useSaveFocus && 'focus' in this.memory && this.memory.focus !== null) {
        focus = String(this.memory.focus)

      }

      return focus
    },
    initMemory () {
      // init memory for save=true || saveFocus=true prop
      this.memory = this.store().get()

      if (!isObject(this.memory)) {
        this.memory = {}
      }

      // if 'open' is not set create it
      if (!('open' in this.memory) || !isObject(this.memory.open)) {
        this.memory.open = {}
      }

      // if 'focus' is not set create it
      if (!('focus' in this.memory)) {
        this.memory.focus = null
      }
    },

    getOpenSpecific () {
      if (this.save) {
        // merge memory and specific params
        this.memory.open = { ...this.memory.open, ...this.unwrapSpecific }
        this.store().set(this.memory)

        let openSpecific = []
        for (let pointer in this.memory.open) {
          openSpecific.push(String(pointer))
        }

        // console.log('memopen', this.memory, openSpecific, this.unwrapSpecific)
        return openSpecific

      } else {
        return this.baseOpenSpecific()
      }
    },

    baseOpenSpecific () {
      // combine with focus pointer if there is one
      return [...this.openSpecific, ...(this.useFocus === null ? [] : [String(this.useFocus)])]
    },

    focusEmit (setup) {

      let { pointer, focusElement } = setup

      if (this.useSaveFocus) {

        const oldFocus = this.useFocus

        if (String(pointer) === String(oldFocus) && String(pointer) !== String(this.focus)) {

          if (this.openSpecific.indexOf(pointer) === -1){
            const index = this.useOpenSpecific.indexOf(pointer);
            if (index > -1) { // only splice array when item is found
              this.useOpenSpecific.splice(index, 1); // 2nd parameter means remove one item only
            }
          }
          // remove focus from memory
          delete this.memory.open[pointer]

          // unset focus if it's already set to same value
          pointer = null

          // remove focus
          focusElement.classList.remove('vue-dd-focus-selected')

        } else {

            // console.log('this.useOpenSpecific', oldFocus, this.useOpenSpecific, this.openSpecific)
          if (this.openSpecific.indexOf(oldFocus) === -1){
            const index = this.useOpenSpecific.indexOf(oldFocus);
            if (index > -1) { // only splice array when item is found
              this.useOpenSpecific.splice(index, 1); // 2nd parameter means remove one item only
            }
          }
          // remove old focus from memory
          delete this.memory.open[oldFocus]

          // quickly unset oldFocus via dom,
          // instead of waiting for Vue re-render
          // makes it feel smoother on large sets
          const oldFocusContainerEl = this.getElement(oldFocus)
          if (oldFocusContainerEl) {
            const oldFocusEl = oldFocusContainerEl.querySelector('.vue-dd-focus')
            if (oldFocusEl) {
              // remove selected class
              oldFocusEl.classList.remove('vue-dd-focus-selected')
            }
          }

          // add focused class
          focusElement.classList.add('vue-dd-focus-selected')
        }

        // if pointer is null, reset to this.focus prop
        this.memory.focus = pointer === null ? this.focus : pointer

        // modify specific downstream
        this.useOpenSpecific.push(this.memory.focus)

        // save to memory
        this.store().set(this.memory)

        // change 'focus' prop that is passed to children
        this.useFocus = this.memory.focus

        this.emitFn(this, 'focus', { focus: this.memory.focus, focusElement: focusElement })
      }
    },

    showEmit (setup) {

      let { type, pointer, focusElement } = setup

      this.emitFn(this, 'show', setup)

      // console.log('show', 'this.useFocus', this.useFocus, 'pointer', pointer)
      if (this.useSaveFocus && this.useFocus === pointer) {
        this.setFocus()
      }
    },
    openEmit (setup) {
      const { isOpen, pointer, level, user } = setup

      if (level === 0) {
        if (this.startClosed && isOpen && this.useOpenSpecific.indexOf('') === -1) {
          this.useOpenSpecific.push('')
        }
        // add class to main vue-dd container class named 'vue-dd-open'
        this.openClass = isOpen
      }


      // console.log('isOpen', isOpen, 'pointer', pointer, 'level', level)
      this.$emit('open', setup)
    },
    toggleEmit (setup) {

      const { event, isOpen, pointer, level } = setup

      if (this.save) {

        const pointerIsSet = pointer in this.unwrapSpecific

        if (isOpen) {

          // remove shared pointer to prevent re-opening
          delete this.shared.hiddenPointers[pointer]

          if (!pointerIsSet){
            this.useOpenSpecific.push(pointer)
          }
          // add specific pointer

          // add to memory store
          this.memory.open[pointer] = true

        } else {

          // set shared pointer so that NodeComplex knows
          // not to hide this pointer as this is being hidden right now
          // via user toggle click
          this.shared.hiddenPointers[pointer] = true

          if (pointerIsSet){
            // if we find this specific opened pointer
            const findKey = this.useOpenSpecific.indexOf(pointer)
            if (findKey >= 0) {
              delete this.useOpenSpecific[findKey]
            }
          }

          // delete from memory
          delete this.memory.open[pointer]
        }

        // save memory state to storage
        this.store().set(this.memory)

        // console.log('set memory', this.memory, this.useOpenSpecific)
      }

      // console.log('toggle', isOpen, 'pointer', pointer, 'level', level)
      this.$emit('toggle', setup)
    },

    store () {
      const key = 'vue-dd.' + this.rootId

      return {
        get: () => {
          try {
            return JSON.parse(window[`${this.storage}Storage`].getItem(key));
          } catch (e) {}
        },
        set: (value) => window[`${this.storage}Storage`].setItem(key, JSON.stringify(value))
      }
    },

    getTypeFn (value) {
      let _type = typeof value;

      if (_type === 'object') {
        if (value === null) {
          return "null";
        }
        if (Array.isArray(value)) {
          return "array";
        }
        return "object";
      }
      if (_type === 'string') {
        if (value.length > this.longText) {
          _type = 'longtext'
        }
      }
      return _type;
    },
    isPrimitiveFn (type) {
      return !(type === 'array' || type === 'object' || type === 'function' || type === 'longtext');
    },
    escapeQuotesFn (text) {
      return this.escapeQuotes ? text.replaceAll('"', '\\"') : text
    },
    unwrapSpecificFn (openSpecific) {
      let unwrap = {}

      if (openSpecific.length) {

        const index = openSpecific

        if (index in unwrapCache) {
          // console.log('using cache')
          return unwrapCache[index]
        } else {
          openSpecific.forEach((el) => {
            const parts = String(el).split(this.delimiter)
            let pointer = '', i = 0
            for (let k in parts) {
              pointer += (i > 0 ? this.delimiter : '') + parts[k]
              unwrap[pointer] = true
              i++
            }
            // if there are any points found
            // unwrap level 0
            if (i > 0) {
              unwrap[''] = true
            }
          })

          // this.useFocus is specifically here inside the function
          // not outside in the computed property,
          // because if it is computed, it becomes too heavy
          // and does too many renders, this is enough
          if (this.useFocus !== null) {
            // add focus element to elements to be unwrapped
            unwrap[this.useFocus] = true
          }

          if (this.startClosed && '' in unwrap){
            delete unwrap['']
          }

          unwrapCache[index] = unwrap
        }

      }
      return unwrap
    },
    // recursive emit
    // more info: https://stackoverflow.com/a/55650245/1502706
    emitFn (vm, name, ...args) {
      while (vm) {
        // recurse only within VueDd own components
        if (vm.$options.name !== 'VueDd'
            && vm.$options.name !== 'NodeComplex'
            && vm.$options.name !== 'NodePrimitive') {
          break;
        }
        vm.$emit(name, ...args)
        vm = vm.$parent
      }
    },
    open() {
      this.$refs.nodeComplex.open()
    },
    close() {
      this.$refs.nodeComplex.close()
    },
    toggle() {
      this.$refs.nodeComplex.toggle()
    },
    // isOpen() {
    //   return this.$refs.nodeComplex.isOpen
    // }
  },
  watch: {
    modelValue: {
      handler (newValue, previousValue) {

        // when value changes, focusSticky will follow the new value
        if (this.focusSticky && newValue !== previousValue) {
          this.setFocus()
        }
      }
    },
    openSpecific () {
      this.useOpenSpecific = this.getOpenSpecific()
    },
    save () {
      this.useOpenSpecific = this.getOpenSpecific()
    }
  },
  // expose: ['$options', 'open', 'toggle', 'close', 'isOpen', 'root'],
  components: {
    NodeComplex,
    NodePrimitive
  }
})
</script>
<style>
@import 'css/VueDd.css';
@import 'css/VueDd.code.css';
</style>
