package com.example.demo.service;

import org.springframework.stereotype.Component;

@Component
public class ComplaintClassifier {

    public String classify(String text) {

        text = text.toLowerCase();

        if (text.contains("electric") || text.contains("power") || text.contains("light"))
            return "Electricity";

        if (text.contains("water") || text.contains("leak") || text.contains("drain"))
            return "Water";

        if (text.contains("road") || text.contains("street") || text.contains("pothole"))
            return "Roads";

        if (text.contains("trash") || text.contains("garbage") || text.contains("waste"))
            return "Sanitation";

        return "General";
    }
}