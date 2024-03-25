import {
  Breadcrumbs,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function DetailCategory(selectedCategory) {
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={handleClick}
    >
      Nguyên liệu chính
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href="/material-ui/getting-started/installation/"
      onClick={handleClick}
    >
      Sản phẩm A
    </Link>,
    <Typography key="3" color="text.primary">
      Bán thành phẩm A-1
    </Typography>,
  ];
  return (
    <Paper elevation={1} sx={{ paddingLeft: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Category</Typography>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {breadcrumbs}
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Tên sản phẩm</Typography>
          <Typography>CL.C23.TRANG.08770-6.R7.2000</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Đơn vị tính quy chuẩn</Typography>
          <Typography>Cây 2.0m</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Tồn kho tối thiểu</Typography>
          <Typography>0</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Actions</Typography>
          <FormControlLabel control={<Checkbox />} label="Có thể mua" />
          <FormControlLabel control={<Checkbox />} label="Có thể bán" />
          <FormControlLabel control={<Checkbox />} label="Có thể SX" />
          <FormControlLabel
            control={<Checkbox />}
            label="Có thể bán mà không có SP tồn kho"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Không sử dụng sản phẩm này nữa"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Class giá hạch toán</Typography>
          <Typography>Phào trắng 10</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Công đoạn sản xuất</Typography>
          <Typography>Cưa 2 đầu lỗi phào</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Comment</Typography>
          <Typography>{/* Add comment here */}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
