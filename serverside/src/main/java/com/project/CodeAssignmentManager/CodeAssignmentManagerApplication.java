package com.project.CodeAssignmentManager;

import com.project.CodeAssignmentManager.enums.Role;
import com.project.CodeAssignmentManager.model.User;
import com.project.CodeAssignmentManager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class CodeAssignmentManagerApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	public static void main(String[] args) {
		SpringApplication.run(CodeAssignmentManagerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		User adminAccount = userRepository.findByRole(Role.ADMIN);
		if(adminAccount==null){
			User user = new User();
			user.setEmail("Admin@gmail.com");
			user.setRole(Role.ADMIN);
			user.setPassword(new BCryptPasswordEncoder().encode("123456"));
			userRepository.save(user);
		}
	}
}
