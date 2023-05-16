export default function setupFormComponent (props, { emit }) {
  const updateValue = (event) => {
    let val = event.target.value

    if (event.target.type === 'select-one') val = JSON.parse(event.target.value)
    if (event.target.type === 'checkbox') val = event.target.checked
    if (event.target.type === 'radio') val = props.value

    emit('update:modelValue', val)
  }

  return { updateValue }
}
