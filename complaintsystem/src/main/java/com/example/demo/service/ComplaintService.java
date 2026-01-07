package com.example.demo.service;


import java.util.List;

import com.example.demo.model.Complaint;

public interface ComplaintService {

    Complaint createComplaint(Complaint complaint, String email);

    List<Complaint> getMyComplaints(String email);

    List<Complaint> allComplaints();

    void updateStatus(Long id, String status);
    Complaint updateAdminComment(Long id, String comment);

}

