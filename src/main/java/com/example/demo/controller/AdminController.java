package com.example.demo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Complaint;
import com.example.demo.repository.ComplaintRepository;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ComplaintRepository repo;

    private boolean isAdmin(HttpServletRequest req) {
        String role = (String) req.getAttribute("role");
        return "ADMIN".equals(role);
    }

    @GetMapping("/complaints")
    public Object viewAll(HttpServletRequest req) {
        if (!isAdmin(req))
            return "Access Denied! Admin Only.";

        return repo.findAll();
    }

    @PutMapping("/update-status/{id}")
    public Object updateStatus(@PathVariable Long id,
                               @RequestParam String status,
                               HttpServletRequest req) {

        if (!isAdmin(req))
            return "Access Denied! Admin Only.";

        Complaint c = repo.findById(id).orElse(null);

        if (c == null)
            return "Complaint Not Found";

        c.setStatus(status);
        repo.save(c);

        return "Status Updated to " + status;
    }
}
