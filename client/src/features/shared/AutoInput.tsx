/* eslint-disable no-use-before-define */
import React, { FC } from 'react'
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
  const classes = useStyles()

  const handleOnChange = (v: string | null) => {
    if (v && onEnter) onEnter(v)
  }

  return (
    <Autocomplete
      options={options}
      classes={{
        option: classes.option,
      }}
      freeSolo
      onChange={(_, v) => handleOnChange(v)}
      renderOption={(option) => option}
      renderInput={(params) => (
        <TextField
          {...params}
          classes={inputClasses}
          className={inputClassname}
          label={error ? error : label}
          error={error ? true : false}
          variant="standard"
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
