package com.example.demo.serviceimplement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Complaint;
import com.example.demo.model.User;
import com.example.demo.repository.ComplaintRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ComplaintClassifier;
import com.example.demo.service.ComplaintService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Complaint createComplaint(Complaint complaint, String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        complaint.setUser(user);
        complaint.setStatus("PENDING");
        complaint.setCreatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getMyComplaints(String email) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return complaintRepository.findByUser(user);
    }

    @Override
    public List<Complaint> allComplaints() {
        return complaintRepository.findAll();
    }

    @Override
    public void updateStatus(Long id, String status) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        complaintRepository.save(complaint);
    }
    
    @Override
    public Complaint updateAdminComment(Long id, String comment) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setAdminComment(comment);
        return complaintRepository.save(complaint);
    }




}
