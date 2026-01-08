package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.model.Complaint;
import com.example.demo.service.ComplaintService;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService service;

    @PostMapping(consumes = "multipart/form-data")
    public Complaint createComplaint(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String address,
            @RequestParam(required = false) MultipartFile photo,
            HttpServletRequest request
    ) throws Exception {

        String email = (String) request.getAttribute("email");
        System.out.println("🔥 SUBMIT BY: " + email);

        Complaint complaint = new Complaint();
        complaint.setTitle(title);
        complaint.setCategory(category);
        complaint.setDescription(description);
        complaint.setAddress(address);

        if (photo != null && !photo.isEmpty()) {
            Files.createDirectories(Paths.get("uploads"));
            String fileName = System.currentTimeMillis() + "_" + photo.getOriginalFilename();
            Files.copy(photo.getInputStream(), Paths.get("uploads").resolve(fileName));
            complaint.setPhotoPath(fileName);
        }

        return service.createComplaint(complaint, email);
    }

    @GetMapping("/my")
    public List<Complaint> myComplaints(HttpServletRequest req) {
        return service.getMyComplaints((String) req.getAttribute("email"));
    }

    @GetMapping("/all")
    public List<Complaint> allComplaints() {
        return service.allComplaints();
    }

    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        service.updateStatus(id, status);
    }
    
    @PutMapping("/{id}/comment")
    public Complaint updateComment(
            @PathVariable Long id,
            @RequestParam String comment
    ) {
        return service.updateAdminComment(id, comment);
    }


}
