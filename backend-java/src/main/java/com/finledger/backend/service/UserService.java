package com.finledger.backend.service;

import com.finledger.backend.entity.User;
import com.finledger.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User save(User user) {
        return userRepository.save(user);
    }
    
    public User upsertUser(String id, String email, String firstName, String lastName, String profileImageUrl) {
        Optional<User> existingUser = userRepository.findById(id);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setEmail(email);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setProfileImageUrl(profileImageUrl);
            return userRepository.save(user);
        } else {
            User newUser = new User(id, email, firstName, lastName, profileImageUrl);
            return userRepository.save(newUser);
        }
    }
}