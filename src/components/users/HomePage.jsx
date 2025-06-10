import React from "react";
import Footer from "./Footer";
import { Box } from "@mui/material";
import bannerAoPhong from "../../assets/images/homepage/banner_aophong.jpg";
import bannerQuanJean from "../../assets/images/homepage/banner_quanjean.png";
import bannerGiay from "../../assets/images/homepage/banner_giay.jpg";

export default function HomePage() {
    return (
        <>
            {/* Ảnh 1: Áo phông */}
            <Box
                component="img"
                src={bannerAoPhong}
                alt="Banner Áo Phông"
                sx={{
                    width: '100%',
                    display: 'block',
                    mb: 2
                }}
            />

            {/* Ảnh 2: Quần jean */}
            <Box
                component="img"
                src={bannerQuanJean}
                alt="Banner Quần Jean"
                sx={{
                    width: '100%',
                    display: 'block',
                    mb: 2
                }}
            />

            {/* Ảnh 3: Giày */}
            <Box
                component="img"
                src={bannerGiay}
                alt="Banner Giày"
                sx={{
                    width: '100%',
                    display: 'block',
                    mb: 2
                }}
            />

        </>
    );
}
