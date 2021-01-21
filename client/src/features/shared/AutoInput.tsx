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

interface Option {
  id: number
  label: string
}

interface AutoInputProps {
  options: Option[]
  onEnter?: (value: string) => void
}

const AutoInput: FC<AutoInputProps> = ({ options, onEnter }) => {
  const [value, setValue] = useState('')
  const classes = useStyles()

  const handleOnEnter: KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      if (onEnter) onEnter(value)
    }
  }

  return (
    <Autocomplete
      options={options}
      classes={{
        option: classes.option,
      }}
      autoHighlight
      getOptionLabel={(option: Option) => option.label}
      renderOption={(option: Option) => (
        <React.Fragment>{option.label}</React.Fragment>
      )}
      renderInput={(
        params:
          | (JSX.IntrinsicAttributes & StandardTextFieldProps)
          | (JSX.IntrinsicAttributes & FilledTextFieldProps)
          | (JSX.IntrinsicAttributes & OutlinedTextFieldProps)
      ) => (
        <TextField
          {...params}
          label="Choose a tag"
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
