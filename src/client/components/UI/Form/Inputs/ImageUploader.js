import React, { useState } from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useIntl } from 'react-intl';
import { formMessages } from '../../../../translations/i18n';
import { useFormContext, Controller } from 'react-hook-form';
import ErrorLabelComponent from '../Labels/ErrorLabelComponent';

const ImageUploader = (props) => {

    const intl = useIntl()

    const [image, setImage] = useState(null);
    const {control, formState: {errors}, setValue} = useFormContext();

    const handleDrop = (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      setValue(props.name, acceptedFiles[0])
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    };
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop, accept: 'image/jpeg, image/jpg, image/png', multiple: false });

    return (
        <Controller
            name={props.name}
            control={control}
            render={({field}) => (
                <Stack>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="120px"
                        width="120px"
                        border="1px solid"
                        borderColor="grey.400"
                        borderRadius={1}
                        p={2}
                        {...getRootProps()}
                    >
                        <input {...getInputProps()} />
                        {image ? (
                        <img src={image} alt="Uploaded" style={{ width: 120, height: 120 }} />
                        ) : (
                            <>
                                {isDragActive ? (
                                <Typography>{intl.formatMessage(formMessages.dragImage)}</Typography>
                                ) : (
                                <Typography>{intl.formatMessage(formMessages.selectOrDrop)}</Typography>
                                )}
                            </>
                        )}
                    </Box>
                    {errors[props.name] && errors[props.name].message && (
                        <ErrorLabelComponent
                            label={errors[props.name].message}
                        />
                    )}
                </Stack>
            )}
        />
    )
}

export default ImageUploader