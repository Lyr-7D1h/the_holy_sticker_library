/* eslint-disable no-use-before-define */
import React, { FC, KeyboardEventHandler, useState } from 'react'
import TextField, {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from '@material-ui/core/TextField'
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

export interface AutoInputOption {
  id: number
  label: string
}

export interface AutoInputProps {
  options: AutoInputOption[]
  error?: string
  onEnter?: (value: string) => void
}

const AutoInput: FC<AutoInputProps> = ({ options, error, onEnter }) => {
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
        if (v) setValue(typeof v === 'string' ? v : v.label)
      }}
      getOptionLabel={(option) => {
        console.log(option)
        if (typeof option === 'string') {
          return option
        } else {
          return option.label
        }
      }}
      renderOption={(option) => <React.Fragment>{option.label}</React.Fragment>}
      renderInput={(
        params:
          | (JSX.IntrinsicAttributes & StandardTextFieldProps)
          | (JSX.IntrinsicAttributes & FilledTextFieldProps)
          | (JSX.IntrinsicAttributes & OutlinedTextFieldProps)
      ) => (
        <TextField
          {...params}
          label={error ? error : 'Choose a tag'}
          error={error ? true : false}
          onChange={(e) => setValue(e.target.value)}
          variant="outlined"
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
