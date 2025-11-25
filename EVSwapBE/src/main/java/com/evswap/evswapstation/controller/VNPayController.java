package com.evswap.evswapstation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/api/vnpay")
public class VNPayController {

    private final String vnp_TmnCode = "83GWVKRR";
    private final String vnp_HashSecret = "21URGP91N6LO3BGFCOP64O4VRILYNAT1";
    private final String vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private final String vnp_ReturnUrl = "https://nonclotting-janessa-chronogrammatical.ngrok-free.dev/api/vnpay/return";

    // Tạo link thanh toán
    @GetMapping("/pay")
    @ResponseBody
    public String createPayment(@RequestParam long amount) {
        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount * 100)); // nhân 100
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", String.valueOf(System.currentTimeMillis()));
        params.put("vnp_OrderInfo", "Thanh toan test");
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        params.put("vnp_IpAddr", "127.0.0.1");

        // Sắp xếp và tạo query string
        String query = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> e.getKey() + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.US_ASCII))
                .reduce((a, b) -> a + "&" + b)
                .orElse("");

        // Tạo checksum
        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, query);

        // URL cuối cùng
        return vnp_Url + "?" + query + "&vnp_SecureHash=" + vnp_SecureHash;
    }

    // Callback khi người dùng quay lại
    @GetMapping("/return")
    @ResponseBody
    public String vnpayReturn(@RequestParam Map<String, String> params) {
        // TODO: kiểm tra checksum, trạng thái thanh toán
        return "Return OK: " + params.toString();
    }

    // IPN URL (VNPAY gửi server-to-server)
    @PostMapping("/ipn")
    @ResponseBody
    public String vnpayIpn(@RequestParam Map<String, String> params) {
        // TODO: kiểm tra checksum, cập nhật trạng thái thanh toán
        return "IPN OK: " + params.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] hashBytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * hashBytes.length);
            for (byte b : hashBytes) sb.append(String.format("%02x", b & 0xff));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
