package com.evswap.evswapstation.service;

import com.evswap.evswapstation.entity.User;
import com.evswap.evswapstation.repository.UserRepository;
import com.evswap.evswapstation.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String input) throws UsernameNotFoundException {
        User user = userRepository.findByUserNameOrEmail(input, input)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + input));
        return new CustomUserDetails(user);
    }
}
