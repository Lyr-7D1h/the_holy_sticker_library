/* eslint-disable no-use-before-define */
import React, { FC, KeyboardEventHandler, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
})

export interface AutoInputProps {
  options: string[]
  label?: string
  classes?: Partial<Record<'root', string>>
  className?: string
  error?: string
  onEnter?: (value: string) => void
}

const AutoInput: FC<AutoInputProps> = ({
  options,
  label = 'Search',
  error,
  onEnter,
  classes: inputClasses,
  className: inputClassname,
}) => {
  const [value, setValue] = useState('')
  const classes = useStyles()

  const handleOnEnter: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      if (value && onEnter) onEnter(value)
    }
  }

  return (
    <Autocomplete
      options={options}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      freeSolo
      onChange={(_, v) => {
        if (v) setValue(v)
      }}
      getOptionLabel={(option) => option}
      renderOption={(option) => <React.Fragment>{option}</React.Fragment>}
      renderInput={(params) => (
        <TextField
          {...params}
          classes={inputClasses}
          className={inputClassname}
          label={error ? error : label}
          error={error ? true : false}
          onChange={(e) => setValue(e.target.value)}
          variant="standard"
          onKeyDown={handleOnEnter}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // disable autocomplete and autofill
          }}
        />
      )}
    />
  )
}

export default AutoInput
