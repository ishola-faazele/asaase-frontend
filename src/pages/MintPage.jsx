import { useState, useEffect } from 'react';
import AsaaseWeb3 from '../../web3/asaase-web3.mjs';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Snackbar, Typography, Paper, Grid } from '@mui/material';
import { Alert } from '@mui/material';

const regionOptions = [
  'ASHANTI', 'BRONG_AHAFO', 'CENTRAL', 'EASTERN', 'GREATER_ACCRA', 
  'NORTHERN', 'UPPER_EAST', 'UPPER_WEST', 'VOLTA', 'WESTERN', 
  'SAVANNAH', 'BONO_EAST', 'OTI', 'AHAFO', 'WESTERN_NORTH', 'NORTH_EAST'
];

const cityOptions = [
  'KUMASI', 'SUNYANI', 'CAPE_COAST', 'KOFORIDUA', 'ACCRA', 
  'TAMALE', 'BOLGATANGA', 'WA', 'HO', 'SEKONDI_TAKORADI', 
  'DAMONGO', 'TECHIMAN', 'DAMBAI', 'GOASO', 'SEFWI_WIAWSO', 
  'NALERIGU'
];

const zoningOptions = [
  'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'AGRICULTURAL', 'MIXED_USE'
];

const schema = yup.object().shape({
  boundaryPoints: yup.string().required('Boundary points are required')
    .matches(/^(-?\d+(\.\d+)?:-?\d+(\.\d+)?)(,\s*-?\d+(\.\d+)?:-?\d+(\.\d+)?)*$/, 'Invalid boundary points format'),
  size: yup.number().positive('Size must be positive').required('Size is required'),
  zoning: yup.string().oneOf(zoningOptions, 'Invalid zoning option').required('Zoning is required'),
  landName: yup.string().required('Land name is required'),
  region: yup.string().oneOf(regionOptions, 'Invalid region').required('Region is required'),
  city: yup.string().oneOf(cityOptions, 'Invalid city').required('City is required'),
  value: yup.number().positive('Value must be positive').required('Value is required'),
  imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
});

const MintPage = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [account, setAccount] = useState(null);
  const [asaaseWeb3, setAsaaseWeb3] = useState(null);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      boundaryPoints: '',
      size: '',
      zoning: 'RESIDENTIAL',
      landName: '',
      region: 'ASHANTI',
      city: 'ACCRA',
      value: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Instance = new AsaaseWeb3();
      const connectedAccount = await web3Instance.connectAccount();
      setAccount(connectedAccount);
      setAsaaseWeb3(web3Instance);
    };
    initWeb3();
  }, []);

  const onSubmit = async (data) => {
    if (!account) {
      setSnackbar({ open: true, message: 'Please connect your wallet first', severity: 'error' });
      return;
    }

    setLoading(true);
    try {
      const boundaryPointsArray = data.boundaryPoints.split(',').map(point => {
        const [latitude, longitude] = point.split(':').map(Number);
        return { latitude, longitude };
      });

      const receipt = await asaaseWeb3.mintToken(
        account,
        boundaryPointsArray,
        parseInt(data.size, 10),
        data.zoning,
        data.landName,
        data.region,
        data.city,
        parseInt(data.value, 10),
        data.imageUrl
      );

      setSnackbar({ open: true, message: `Mint successful: ${receipt.transactionHash}`, severity: 'success' });
      reset();
    } catch (error) {
      setSnackbar({ open: true, message: `Mint failed: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register Land
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="boundaryPoints"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Boundary Points"
                  fullWidth
                  error={!!errors.boundaryPoints}
                  helperText={errors.boundaryPoints?.message}
                  placeholder="latitude:longitude, comma-separated"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="size"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Size (sq meters)"
                  type="number"
                  fullWidth
                  error={!!errors.size}
                  helperText={errors.size?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.zoning}>
              <InputLabel>Zoning</InputLabel>
              <Controller
                name="zoning"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Zoning">
                    {zoningOptions.map((zone) => (
                      <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.zoning && <Typography variant="caption" color="error">{errors.zoning.message}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="landName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Land Name"
                  fullWidth
                  error={!!errors.landName}
                  helperText={errors.landName?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.region}>
              <InputLabel>Region</InputLabel>
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Region">
                    {regionOptions.map((reg) => (
                      <MenuItem key={reg} value={reg}>{reg}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.region && <Typography variant="caption" color="error">{errors.region.message}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.city}>
              <InputLabel>City</InputLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="City">
                    {cityOptions.map((ct) => (
                      <MenuItem key={ct} value={ct}>{ct}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.city && <Typography variant="caption" color="error">{errors.city.message}</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Value (in wei)"
                  type="number"
                  fullWidth
                  error={!!errors.value}
                  helperText={errors.value?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Image URL"
                  fullWidth
                  error={!!errors.imageUrl}
                  helperText={errors.imageUrl?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Registering...' : 'Register Land'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MintPage;