package com.example.demo.serviceimplement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.AuthService;
@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private JwtUtil jwtUtil;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    @Override
    public String register(RegisterRequest r) {
        if (userRepo.findByEmail(r.getEmail()) != null)
            return "Email already registered";
        User u = new User();
        u.setName(r.getName());
        u.setEmail(r.getEmail());
        u.setPassword(encoder.encode(r.getPassword()));
        u.setRole("USER");
        userRepo.save(u);
        return "Registered Successfully";
    }
    @Override
    public String login(LoginRequest request) {
        User u = userRepo.findByEmail(request.getEmail());
        if (u == null) return "Invalid Email";
        if (!encoder.matches(request.getPassword(), u.getPassword()))
            return "Invalid Password";
        return jwtUtil.generateToken(u.getEmail(), u.getRole());
    }
}
