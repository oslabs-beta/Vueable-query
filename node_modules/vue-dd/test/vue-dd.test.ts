import { nextTick, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import VueDd from '../src/VueDd.vue'

export default function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const defaults = {
  arrow: true,
  arrowOpen: '-',
  arrowClosed: '+',
}

describe('vue dd init', () => {

  test('import', () => {
    expect(VueDd).toBeTruthy()
  })

  describe('primitives', () => {

    test('null', async () => {

      const modelValue = null

      const wrapper = mount(VueDd, {
        props: { ...defaults, modelValue }
      })

      await nextTick()

      const text = wrapper.text()

      expect(text).toContain('null')
    })

    test('undefined', async () => {

      const modelValue = undefined
      // const promise = new Promise(_resolve => resolve = _resolve)
      const wrapper = mount(VueDd, {
        props: { ...defaults, modelValue }
      })

      await nextTick()

      const text = wrapper.text()

      // console.log(text)
      expect(text).toContain('undefined')
    })

    test('string', async () => {

      const modelValue = 'string'
      // const promise = new Promise(_resolve => resolve = _resolve)
      const wrapper = mount(VueDd, {
        props: { ...defaults, modelValue }
      })

      await nextTick()

      const text = wrapper.text()
      console.log(text)

      expect(text).toContain('string')
    })

    test('number', async () => {

      const modelValue = 1000

      const wrapper = mount(VueDd, {
        props: { ...defaults, modelValue }
      })

      await nextTick()

      const text = wrapper.text()

      // console.log(text)

      expect(text).toContain(modelValue)
    })

    describe('complex', () => {

      test('object', async () => {

        const modelValue = { test: 1 }

        const wrapper = mount(VueDd, {
          props: { ...defaults, modelValue }
        })

        await nextTick()

        const text = wrapper.text()

        expect(text).toContain('test:1')
      })

      test('array', async () => {

        const modelValue = ['test']

        const wrapper = mount(VueDd, {
          props: { ...defaults, modelValue }
        })

        await nextTick()

        const text = wrapper.text()

        console.log(text)
        expect(text).toContain('test')
      })
      //
      // test('array of objects: test', async () => {
      //
      //   const modelValue = Object.freeze([{ obj: { subobj: 'hello', unreachableObjectContent: { unreachable: true } } }, { obj: 2 }])
      //
      //   const level = 3;
      //
      //   const wrapper = mount(VueDd, {
      //     props: {
      //       ...defaults,
      //       modelValue,
      //       openLevel: level,
      //       preview: 0 //disable previews to test for level 4 opening
      //     },
      //   })
      //
      //   await nextTick()
      //   await sleep(34 * level * 3)
      //
      //   const text = wrapper.text()
      //
      //   console.log('array of objects test')
      //   console.log(text)
      //
      //   expect(text).toContain('+unreachableObjectContent:{...}')
      //
      // })
    })

    // test('array of objects with refs', async () => {
    //
    //   const modelValue = ref([22, { obj: ref(false) }, { obj: ref(true) }])
    //
    //   // console.log(modelValue)
    //   const level = 1
    //   const wrapper = mount(VueDd, {
    //     props: {
    //       ...defaults,
    //       modelValue,
    //       openLevel: level,
    //       openSpecific: ['_rawValue.1', '_rawValue.2'],
    //       // preview: 5
    //     },
    //   })
    //
    //   await nextTick()
    //
    //   await sleep(34 * 1 * 3)
    //   const text = wrapper.text()
    //
    //   console.log(text)
    //   expect(text).toContain('_value:R[[3]22,+R{...},+R{...}]')
    //   // expect(text).toContain('_value:true')
    //
    // })

  })

})


