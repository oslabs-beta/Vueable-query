<template>
  <div :id="id" :class="{'vue-dd-body':true, 'vue-dd-box-closed': !isOpen}">
    <div class="vue-dd-start">
      <!--focus-->
      <span v-if="saveFocus"
            ref="focusElement"
            class="vue-dd-focus vue-dd-icon-eye"
            @click.prevent="focusEmit"
            @mouseenter="hover=true"
            @mouseup="hover=false"
            @mouseleave="hover=false"
            :class="{
              'vue-dd-focus-hover':hover,
              'vue-dd-focus-selected':isFocused
            }"
      ></span>

      <!--arrow-->
      <span
        v-if="arrow"
        @click.prevent="toggleOpen"
        class="vue-dd-arrow"
        :class="{'vue-dd-arrow-collapsed': !isOpen}"
        v-html="isOpen ? arrowOpen : arrowClosed"></span>


      <!--name-->
      <span
        v-if="showName"
        @click.prevent="toggleOpen"
        @mousedown="preventSelect($event)"
        class="vue-dd-name"
        :class="{
            'vue-dd-f-name': isFunction,
            'vue-dd-key-of-array': parentIsArray
          }">{{ name }}</span><span class="vue-dd-colon" v-if="level !== 0">:</span>


      <!--R-->
      <span v-if="isIterable && isReactive"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            class="vue-dd-r"
            title="Reactive">R</span>

      <!--Ref-->
      <span v-else-if="isIterable && isRef"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            class="vue-dd-ref"
            title="Ref">Ref</span>

      <!--f-->
      <span v-else-if="isFunction"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            class="vue-dd-f"
            title="Function">f</span>

      <!--function start-->
      <pre v-if="isFunction && isOpen"
           @click.prevent="toggleOpen"
           class="vue-dd-f-start"><span v-html="functionName"></span><span class="vue-dd-comma"
                                                                           v-if="shouldComma && !isOpen">,</span></pre>

      <!--{ | [-->
      <span v-if="isIterable && isOpen"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            :class="charClass"
            v-html="charOpen" />

      <!--instanceof-->
      <span v-if="isIterable && isOpen && instanceOf"
            class="vue-dd-instance">{{ instanceOf }}</span>

      <!--size-->
      <span v-if="isIterable && isOpen && getSize"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            class="vue-dd-size"><span class="vue-dd-size-bracket">[</span>{{ getSize }}<span
        class="vue-dd-size-bracket">]</span></span>

      <!--promise closed-->
      <span v-if="isIterable && isPromise && !isOpen"
            @click.prevent="toggleOpen"
            @mousedown="preventSelect($event)"
            class="vue-dd-instance vue-dd-promise-prototype">Promise</span>

      <!--forget-->
      <span v-if="isOpen && level === 0 && save && !cleared"
            @click.prevent="askForget=true"
            class="vue-dd-forget vue-dd-forget-q"
            :class="{'vue-dd-forget-q-ask':askForget}">
        <span v-if="askForget">clear save?</span>
        <span v-else>forget</span>
      </span>

      <!--forget question-->
      <span v-if="askForget">
        <span class="vue-dd-forget vue-dd-forget-yes" @click.prevent="forget">yes</span>
        <span class="vue-dd-forget vue-dd-forget-no" @click.prevent="askForget=false">no</span>
      </span>

      <!--forget cleared-->
      <span class="vue-dd-forget-cleared" v-if="cleared">
        cleared
      </span>

    </div>
    <div
      :class="{
      'vue-dd-box': isOpen,
      'vue-dd-box-closed': !isOpen,
      'vue-dd-box-complex': true
    }">
      <div>

        <!--{-->
        <span v-if="isIterable && !isOpen" :class="charClass" v-html="charOpen" />

        <!--size-->
<!--        <span v-if="isIterable && !isOpen && getSize"-->
<!--              @click.prevent="toggleOpen"-->
<!--              @mousedown="preventSelect($event)"-->
<!--              class="vue-dd-size"><span class="vue-dd-size-bracket">[</span>{{ getSize }}<span-->
<!--          class="vue-dd-size-bracket">]</span></span>-->

        <!--promise isOpen-->
        <span v-if="isIterable && isPromise" class="vue-dd-promise-content">&lt;pending&gt;</span>

        <!--expand button-->
        <span
          v-if="isIterable && !isOpen && !allowPreview"
          @click.prevent="expand"
          class="vue-dd-expand"><span class="vue-dd-size-bracket">(</span><span class="vue-dd-expand-more" v-html="more"></span><span class="vue-dd-size-bracket">)</span></span>

        <div v-if="isIterable && (isOpen || expanded)">

          <!--iterate array | object | map | set -->
          <div v-for="index in isOpen
                  // show all
                  ? items.length
                  // show preview
                  : (allowPreview < items.length ? allowPreview : items.length)"
               :key="index">

            <div>
              <!-- string | number | bigint | boolean | null | undefined | symbol -->
              <node-primitive
                v-if="isPrimitiveFn(getSpecialType(items[index-1]))"

                :root="root"
                :rootId="rootId"

                :modelValue="getModelValue(items[index-1])"
                :name="items[index-1]"
                :escapeQuotes="escapeQuotes"
                :focus="focus"
                :save="save"
                :saveFocus="saveFocus"
                :delimiter="delimiter"

                :pointer="getPointer(items[index-1])"
                :parentOpen="isOpen"
                :type="getSpecialType(items[index-1])"
                :parentType="type"
                :size="getSize"
                :position="index"
                :expanded="expanded"

                :escapeQuotesFn="escapeQuotesFn"
                :emitFn="emitFn"

                @openParent="openParent"
              />
              <!-- object, array, map, set, function, longtext -->
              <node-complex
                v-else

                :root="root"
                :rootId="rootId"

                :modelValue="getModelValue(items[index-1])"
                :name="items[index-1]"
                :deep="isRef ? false : deep"
                :watch="watch"
                :preview="isOpen ? preview : false"
                :openLevel="useOpenLevel"
                :openSpecific="useOpenSpecific"
                :startClosed="startClosed"
                :longText="longText"
                :escapeQuotes="escapeQuotes"
                :focus="focus"
                :save="save"
                :saveFocus="saveFocus"
                :delimiter="delimiter"
                :more="more"

                :arrow="arrow"
                :arrowOpen="arrowOpen"
                :arrowClosed="arrowClosed"
                :pointer="getPointer(items[index-1])"
                :parentType="type"
                :parentOpen="isOpen"
                :type="getSpecialType(items[index-1])"
                :shared="shared"
                :level="level+1"
                :size="getSize"
                :position="index"

                :escapeQuotesFn="escapeQuotesFn"
                :getTypeFn="getTypeFn"
                :isPrimitiveFn="isPrimitiveFn"
                :unwrapSpecificFn="unwrapSpecificFn"
                :emitFn="emitFn"
                @openParent="openParent"
              />
            </div>
          </div>
        </div>

        <!--function content-->
        <div v-if="isFunction" class="vue-dd-f-content">

          <!--if isOpen and function content exists-->
          <pre v-if="isOpen && functionContent"><span v-html="functionContent"></span><span class="vue-dd-comma"
                                                                                            v-if="shouldComma">,</span></pre>
          <!--if isOpen and function content does not exist-->
          <span v-else-if="isOpen && !functionContent"></span>
          <!--if not isOpen, display inline-->
          <span v-else @click.prevent="toggleOpen" class="vue-dd-f-inline"><span
            v-html="allowPreview ? functionInlinePreview : functionInline"></span><span
            class="vue-dd-comma" v-if="shouldComma">,</span>
          </span>
        </div>

        <!--long text-->
        <div v-if="isLongText" class="vue-dd-string">
          <span v-if="isOpen">{{ longTextContent }}<span class="vue-dd-comma" v-if="shouldComma">,</span></span>
          <span v-else>{{ longTextInline }}<span class="vue-dd-comma" v-if="shouldComma">,</span></span>
        </div>

        <!--expand button-->
        <span
          v-if="isIterable && !isOpen && allowPreview && preview < items.length"
          @click.prevent="expand"
          class="vue-dd-expand"
          v-html="more"></span>

        <!--} or ]-->
        <span v-if="isIterable" :class="charClass" v-html="charClose" />
        <span v-if="isIterable && shouldComma" class="vue-dd-comma">,</span>
      </div>
    </div>
  </div>
</template>

<script>
import NodePrimitive from "./NodePrimitive.vue";
import { isReactive, isRef } from 'vue';
import { isPromise, onFrame } from './helpers.js';

import hljs from './highlight.js/core.min.js';
import javascript from './highlight.js/javascript.min.js';

hljs.registerLanguage('javascript', javascript);

// this is needed for cache, does not need to be reactive
let allPointerCache = {}

export default {
  name: 'NodeComplex',
  inheritAttrs: false,
  emits: ['show', 'open', 'toggle', 'focus', 'openParent', 'forget'],
  props: {
    // ref
    root: undefined,
    rootId: [String, Number],
    // options
    modelValue: undefined,
    name: [String, Number],
    openLevel: [Number, Array],
    openSpecific: Array,
    startClosed: Boolean,
    longText: Number,
    escapeQuotes: Boolean,
    deep: Boolean,
    watch: Boolean,
    preview: [Boolean, Number],
    previewInitial: Boolean,
    focus: [String, Number],
    arrow: Boolean,
    arrowOpen: String,
    arrowClosed: String,
    delimiter: String,
    more: String,
    save: Boolean,
    saveFocus: Boolean,
    // helpers
    shared: Object,
    type: String,
    parentType: String,
    parentOpen: Boolean,
    pointer: { type: [String, Number], default: '' },
    level: { type: Number, default: 0 },
    size: Number,
    position: Number,
    // functions
    escapeQuotesFn: Function,
    isPrimitiveFn: Function,
    getTypeFn: Function,
    unwrapSpecificFn: Function,
    emitFn: Function
  },
  data () {
    return {
      id: this.getId(),
      hideTimes: 0,
      isOpen: false,
      expanded: false,
      openSublevel: false,
      items: [],
      getMapSet: {},
      getSize: 0,
      useOpenLevel: this.openLevel,
      useOpenSpecific: this.openSpecific,
      originalOpenLevel: this.openLevel,
      askForget: false,
      cleared: false,
      hover: false,
      unwatch: () => {},
      initializedClosed: false
    }
  },
  mounted () {
    this.showEmit()
  },
  created () {
    this.expanded = this.allowPreview


    this.items = this.makeItems()
    if (this.watch) {
      this.unwatch = this.watchModelValue(this.deep)
    }

    this.useOpenSpecific = this.openSpecific
  },
  methods: {
    showEmit () {
      this.emit('show', {
        pointer: this.pointer,
        focusElement: this.$refs.focusElement,
        type: 'complex'
      })
      return true
    },
    getAllPointer (pointer) {
      let allPointer = '*'
      pointer = String(pointer)

      if (pointer in allPointerCache) {
        allPointer = allPointerCache[pointer]
      } else {
        const pointerParts = pointer.split(this.delimiter)
        pointerParts.pop()
        if (pointerParts.length) {
          allPointer = pointerParts.join(this.delimiter) + this.delimiter + '*'
        }
        allPointerCache[pointer] = allPointer
      }
      return allPointer
    },
    forget () {
      this.emitFn(this, 'forget', { askForget: this.askForget })

      this.askForget = false
      this.cleared = true

      setTimeout(() => this.cleared = false, 1000)
    },
    openParent () {
      if (!this.isOpen) {
        this.toggleOpen(null, true)
      }
    },
    getId () {
      return this.level === 0
        ? `_${this.rootId}`
        : `_${this.rootId}${this.delimiter}${this.pointer}`
    },
    watchModelValue (deep) {
      return this.$watch('modelValue', () => {
          this.items = this.makeItems()
        },
        { deep: deep })
    },
    getPointer (index) {
      return this.pointer ? this.pointer + this.delimiter + index : String(index)
    },
    getSpecialType (index) {
      if (this.isMapSet) {
        return this.getTypeFn(this.getMapSet[index])
      } else {
        return this.getTypeFn(this.modelValue[index])
      }
    },
    getModelValue (index) {
      if (this.isMapSet) {
        return this.getMapSet[index]
      } else {
        return this.modelValue[index]
      }
    },
    // prevent select on double click
    preventSelect (event) {
      if (event.detail > 1) {
        event.preventDefault();
      }
    },
    /**
     * Get the name of key of an object or array
     * If it is an array, those keys are not named
     * @param key
     * @returns {string|*}
     */
    getName (key) {
      return this.isArray ? '' : key
    },
    expand () {
      if (!this.isOpen) {
        this.toggleOpen(null, true)
      }
      this.expanded = true
      this.openSublevel = true
      // console.log('expand', this.pointer, this.isOpen, this.expanded)
    },
    toggleOpen (event, value) {

      const openValue = value === undefined ? !this.isOpen : value
      this.setOpen(openValue, { user: true })

      this.emit('toggle', {
        event: event,
        isOpen: this.isOpen,
        level: this.level,
        pointer: this.pointer
      })
    },
    emit (name, ...args) {
      this.emitFn(this, name, ...args)
    },
    makeItems () {
      switch (true) {
        case this.isObject:
          let keys = [], i = 0;
          switch (true) {
            case this.isSet:
              this.getMapSet = Array.from(this.modelValue)
              keys = [...Array(this.getMapSet.length).keys()]
              this.getSize = this.getMapSet.length
              break;
            case this.isMap:
              this.modelValue.forEach((value, key) => {
                this.getMapSet[key] = value
                keys[i] = key
                i++
              });
              this.getSize = i
              break;
            default:
              for (let k in this.modelValue) {
                keys[i] = k
                i++
              }
              this.getSize = i
          }
          return keys;
        case this.isArray:
          this.getSize = this.modelValue.length
          return [...Array(this.modelValue.length).keys()]
        default:
          return this.modelValue
      }
    },

    parentIsOpen () {
      // this function is necessary for proper functioning of 'save' mode
      // together with open-specific option
      return (this.$parent.$options.name === 'NodeComplex' && this.$parent.isOpen)
        // VueDd is the root so no open parent check for it
        || this.$parent.$options.name === 'VueDd'
    },

    focusEmit () {
      this.emit('focus', {
        pointer: this.pointer,
        focusElement: this.$refs.focusElement
      })
    },

    setOpen (value, { user }) {

      this.isOpen = value


      this.emit('open', {
        isOpen: this.isOpen,
        level: this.level,
        pointer: this.pointer,
        user: user
      })

      this.expanded = this.allowPreview

      if (this.isOpen) {
        this.$emit('openParent')
      }
    },
    openPointer (open) {
      if (open) {
        // onFrame is important here to catch re-renders
        onFrame(() => this.setOpen(true, { user: false }))
        this.openSublevel = false
      } else {
        this.closePointer()
      }
    },
    closePointer () {
      // if user clicks expand {...} button within
      // preview list it sets this.openSublevel = true
      // it should not be auto-closed, otherwise
      // this.openSublevel = false; by default
      // so it will set this.setOpen(false...) or close
      const parentIsOpenOrIsRootNode = this.parentIsOpen() || this.openLevel === 0
      this.setOpen(this.openSublevel && parentIsOpenOrIsRootNode, { user: false })
      // openSublevel should be reset back to false
      this.openSublevel = false
    },
    open () {
      this.toggleOpen(null, true)
    },
    close () {
      this.toggleOpen(null, false)
    },
    toggle () {
      this.toggleOpen(null, !this.isOpen)
    },
  },
  computed: {
    parentIsArray () {
      return this.parentType === 'array'
    },
    unwrapSpecific () {
      return this.unwrapSpecificFn(this.openSpecific)
    },
    allowPreview () {
      return !this.previewInitial && this.level === 0 ? false : this.preview
    },
    isMap () {
      return this.isObject && this.modelValue instanceof Map
    },
    isSet () {
      return this.isObject && this.modelValue instanceof Set
    },
    isMapSet () {
      return this.isMap || this.isSet
    },
    instanceOf () {
      const name = this.isObject
      && 'constructor' in this.modelValue
      && 'name' in this.modelValue.constructor
        ? this.modelValue.constructor.name
        : ''
      return name === 'Object' ? '' : name
    },
    nextLevel () {
      return this.level + 1
    },
    charClass () {
      return this.isObject ? 'vue-dd-obj-char' : 'vue-dd-arr-char'
    },
    charOpen () {
      return this.isObject ? "{" : "["
    },
    charClose () {
      return this.isObject ? "}" : "]"
    },
    functionInlinePreview () {
      const length = this.items.toString().length
      const maxLength = 100
      if (length > maxLength) {
        return this.items.toString().substring(0, maxLength) + '...}'
      } else {
        return this.items.toString()
      }
    },
    functionInline () {
      let f = this.modelValue.toString()
      switch (true) {
        case f.startsWith('function '):
          f = f.substring(9).trim()
          if (f.startsWith(this.name)) {
            f = f.substring(this.name.length)
          }
          break
        case f.startsWith('()'):
          f = '(){...}'
          break
        case f.startsWith(this.name):
          f = f.substring(this.name.length)
          break
      }
      const maxFuncLength = 25
      if (f.length > maxFuncLength) {
        f = f.substring(0, maxFuncLength) + '...'
      }
      return f
    },
    functionName () {
      let code = String(this.items)

      const newLinePosition = code.indexOf('\n')
      if (newLinePosition >= 0) {
        code = code.substring(0, newLinePosition)
      }
      const highlight = hljs.highlight(code, { language: 'javascript' }).value

      return highlight
    },
    functionContent () {

      let lines = String(this.items).trim().split('\n')
      if (lines.length) {
        // calculate extra white space
        const lastLine = lines.length - 1
        const trimLeftSize = lines[lastLine].indexOf('}')

        // trim extra white space on the left, extra tabs/spaces
        lines = lines.map(val => val.substring(trimLeftSize))

        // remove first line as we want to show only content
        lines.shift()

        const code = lines.join('\n')

        const highlight = hljs.highlight(code, { language: 'javascript' }).value

        return highlight
      }

      return ''
    },
    shouldComma () {
      return this.size && this.position && this.position !== this.size
    },
    longTextInline () {

      let text = this.modelValue.toString().substring(0, this.longText)
      text = this.escapeQuotesFn(text)
      text = `"${text}..."`

      return text
    },
    longTextContent () {
      let text = this.modelValue
      text = this.escapeQuotesFn(text)
      text = `"${text}"`

      return text
    },
    isLongText () {
      return this.type === 'longtext'
    },
    isRefReactive () {
      return this.isRef || this.isReactive
    },
    isIterable () {
      return this.isArray || this.isObject
    },
    isArray () {
      return this.type === 'array'
    },
    isObject () {
      return this.type === 'object'
    },
    isFunction () {
      return this.type === 'function'
    },
    isPromise () {
      return isPromise(this.modelValue)
    },
    isReactive () {
      return isReactive(this.modelValue)
    },
    isRef () {
      return isRef(this.modelValue)
    },
    isFocused () {
      return String(this.pointer) === String(this.focus)
    },
    showName () {
      return (!this.parentIsArray && this.nameString)
        // show array index when the arrays are open
        || (this.parentIsArray && this.parentOpen)
    },
    nameString () {
      return String(this.name)
    }
  },
  watch: {

    parentOpen (newValue) {
      if (!newValue) {
        // if parent changes to closed, we are in sublevel
        // we need to close the sublevel
        this.expanded = false
        this.setOpen(false, { user: false});
        // console.log('close expansion', this.pointer)
      }
    },

    // make reactive to startClose prop change
    startClosed () {
      if (this.level === 0) {
        console.log('start closed changed to', !this.startClosed)
        this.setOpen(!this.startClosed, { user: false })
      }
    },

    // opens levels
    openLevel: {
      handler (value) {

        this.useOpenLevel = this.openLevel

        if (this.startClosed && this.level === 0 && !this.initializedClosed) {
          // start closed, do not open level 0
          this.initializedClosed = true
          return
        }

        // open levels up to this one
        if (typeof this.openLevel === 'number') {
          this.openPointer(this.level < this.openLevel);
        }

        // handle several levels to pre-open [1,2,3,4]
        if (this.getTypeFn(this.openLevel) === 'array') {
          for (let i = 0; i < this.openLevel.length; i++) {
            this.openPointer(this.level === parseInt(this.openLevel[i]))
          }
        }

      },
      immediate: true
    },

    // opens specific pointers
    unwrapSpecific: {
      handler (value) {

        if (this.openSpecific.length
          && typeof this.pointer !== 'undefined'
          && this.pointer !== null) {


          let allPointer = this.getAllPointer(this.pointer)

          // check existence within the list
          if (this.pointer in value || allPointer in value) {

            if (this.pointer in this.shared.hiddenPointers) {
              /**
               * this prevents save: true mode from colliding
               * with open-specific parameters
               * those items that are being hidden should not
               * be opening up again, this prevents them from
               * opening up, so this line is very important
               * for seamless integration between save: true and
               * open-specific: ['node','node1.node2'] modes
               */
              return void 0 // do not open, hiding is in progress
            }

            // onFrame & $nextTick is necessary here!
            // just $nextTick is not enough, we have to wait for request animation frame
            onFrame(() => {
              this.$nextTick(() => {
                if (this.parentIsOpen()) {
                  this.setOpen(true, { user: false })
                }
              })
            })

          }
        }
      },
      immediate: true
    },

    // fires events on open and closing
    isOpen: {
      handler (value, oldValue) {

        if (!value) {

          const hideEverything = () => {
            this.useOpenLevel = 0
            this.useOpenSpecific = []
          }
          // on initial load this will hide everything
          // even if openSpecific is specified, this semi-complicated
          // logic is necessary
          if (this.hideTimes === 0) {
            hideEverything()
          } else {
            // setTimeout:1 speeds up hiding significantly
            setTimeout(() => hideEverything(), 1)
          }
          // all later hiding is sped up with setTimeout
          this.hideTimes++
        } else {

          // remake items on open ?
          // this can be too heavy sometimes ?
          // but allows to see objects that are not reactive be updated
          // on close and open of the complex item
          this.items = this.makeItems()

          this.useOpenLevel = this.openLevel
          this.useOpenSpecific = this.openSpecific
        }


      },
      immediate: true
    },

    // expand previews
    preview (preview) {
      this.expanded = preview;
      this.setOpen(!!(this.isOpen && preview), { user: false });
    },
    previewInitial () {
      this.expanded = this.allowPreview
    },
    openSpecific () {
      this.useOpenSpecific = this.openSpecific
    }
  },
  // expose: ['$options', 'open', 'toggle', 'close', 'isOpen'],
  components: {
    NodePrimitive
  }
}
</script>
