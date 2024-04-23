import React, { useRef, useState, useEffect, KeyboardEvent, ChangeEvent } from 'react';

interface Props {
  autoFocus?: boolean
  readOnly?: boolean
  valid?: string
  invalid?: string
  handler?: () => void
  parrentRef?: React.RefObject<HTMLInputElement>
  type?: string
  maxLength?: number
  defaultValue?: string
  value?: string
  disabled?: boolean
  placeholder?: string
  parentChange?: (value: string) => void
  className?: string
  inputClassName?: string
  icon?: string
  tooltip?: boolean
  message?: string
}

const IconInput: React.FC<Props> = (props: Props) => {
  const calcValid = (valid: string | undefined): string | undefined => {
    if (!valid) return
    let i = 0,
      j,
      k,
      before,
      after,
      direction = 1,
      temp

    while ((i = valid.indexOf("->")) > 0) {
      before = valid.substring(0, i)
      after = valid.substring(i + 2)
      j = valid.charAt(i - 1).charCodeAt(0)
      k = valid.charAt(i + 2).charCodeAt(0)
      direction = j < k ? 1 : -1
      temp = ""
      for (j = j + 1; j !== k; j += direction) temp += String.fromCharCode(j)
      valid = before + temp + after
    }
    return valid
  }

  let valid = calcValid(props.valid)

  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13 && props.handler !== undefined) props.handler()
  }

  const keyUpCapture = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (valid) {
      if (valid.indexOf(evt.key) >= 0) return true
      else evt.preventDefault()
    } else if (props.invalid) {
      if (props.invalid.indexOf(evt.key) >= 0) evt.preventDefault()
      else return true
    } else return true
  }

  useEffect(() => {
    if (props.autoFocus && !props.readOnly && props.parrentRef && props.parrentRef.current) 
      props.parrentRef.current.focus()
  }, [props.autoFocus, props.readOnly])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (props.parentChange) props.parentChange(e.target.value)
  }

  const [passwordShown, setPasswordShown] = useState(false)
  const togglePasswordVisiblity = () => setPasswordShown(!passwordShown)

  return (
    <div className={props.className}>
      <input
        className={props.inputClassName}
        type={props.type}
        maxLength={props.maxLength}
        defaultValue={props.defaultValue ? props.defaultValue : props.value ? props.value : ''}
        onKeyDown={keyDown}
        onKeyUpCapture={keyUpCapture}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onChange={handleChange}
        readOnly={props.readOnly}
        ref={props.parrentRef}
      />
      {props.type === "password" ? <i onClick={togglePasswordVisiblity} className={passwordShown?"flaticon-visibility pass-eye": "flaticon-view pass-eye"}></i> : ''}
      {props.tooltip ? <span>{props.message}</span> : ""}
    </div>
  )
}

export default IconInput