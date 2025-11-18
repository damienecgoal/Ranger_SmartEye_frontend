import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
  SelectChangeEvent
} from '@mui/material';
import { FileRecord } from 'types/development/files';
import { FormattedMessage, useIntl } from 'react-intl';

type ChipColor = 'error' | 'success' | 'info' | 'warning' | 'secondary' | 'primary' | 'default';

interface MediaTypeFilterProps {
  selectedTypes: FileRecord['fileType'][];
  onFilterChange: (types: FileRecord['fileType'][]) => void;
  label?: string;
}

const ALL_FILE_TYPES: FileRecord['fileType'][] = ['video', 'audio', 'image', 'gps', 'log', 'firmware'];

const getFileTypeInfo = (fileType: FileRecord['fileType']): { label: string; color: ChipColor; icon: string } => {
  const typeMap: Record<string, { label: string; color: ChipColor; icon: string }> = {
    video: { label: 'Video', color: 'error', icon: '🎬' },
    image: { label: 'Image', color: 'info', icon: '🖼️' },
    audio: { label: 'Audio', color: 'success', icon: '🎵' },
    gps: { label: 'GPS', color: 'warning', icon: '📍' },
    log: { label: 'Log', color: 'secondary', icon: '📋' },
    firmware: { label: 'Firmware', color: 'primary', icon: '⚙️' }
  };
  return typeMap[fileType as string] || { label: 'Unknown', color: 'default', icon: '📄' };
};

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({
  selectedTypes = [],
  onFilterChange,
  label = "Filter by Media Type"
}) => {

  const intl = useIntl();

  const handleChange = (event: SelectChangeEvent<FileRecord['fileType'][]>) => {
    const value = event.target.value;
    const newSelection = typeof value === 'string' ? [value as FileRecord['fileType']] : value;
    onFilterChange(newSelection);
  };

  const handleDelete = (typeToDelete: FileRecord['fileType'], event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = selectedTypes.filter(type => type !== typeToDelete);
    onFilterChange(newSelection);
  };

  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    onFilterChange([]);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="media-filter-label">{label}</InputLabel>
      <Select
        labelId="media-filter-label"
        multiple
        value={selectedTypes}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        sx={{minWidth:'130px', maxWidth:'170px'}}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center'}}>
            {selected.length === 0 ? (
              <Chip label="All media types" variant="outlined" size="small" />
            ) : (
              <>
                {selected.map((type) => {
                  const typeInfo = getFileTypeInfo(type);
                  return (
                    <Chip
                      key={type}
                      label={`${typeInfo.icon} ${typeInfo.label}`}
                      color={typeInfo.color}
                      size="small"
                      onDelete={(e) => handleDelete(type, e)}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  );
                })}
                {selected.length > 1 && (
                  <Chip
                    label={intl.formatMessage({ id: 'media filter clear' })}
                    size="small"
                    variant="outlined"
                    onDelete={handleClearAll}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                )}
              </>
            )}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
            },
          },
        }}
      >
        <MenuItem value="all" onClick={() => onFilterChange([])}>
          <em><FormattedMessage id={'media filter allType'} /></em>
        </MenuItem>
        
        {ALL_FILE_TYPES.map((type) => {
          const typeInfo = getFileTypeInfo(type);
          const isSelected = selectedTypes.includes(type);
          
          return (
            <MenuItem
              key={type}
              value={type}
              selected={isSelected}
              sx={{
                fontWeight: isSelected ? 'bold' : 'normal',
                backgroundColor: isSelected ? 'action.selected' : 'transparent',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <span style={{ fontSize: '1.2em' }}>{typeInfo.icon}</span>
                <span>{typeInfo.label}</span>
                {isSelected && (
                  <Chip 
                    label={intl.formatMessage({ id: 'media filter selected' })}
                    size="small" 
                    color={typeInfo.color} 
                    variant="outlined"
                    sx={{ ml: 'auto', fontSize: '0.7em' }}
                  />
                )}
              </Box>
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MediaTypeFilter;
