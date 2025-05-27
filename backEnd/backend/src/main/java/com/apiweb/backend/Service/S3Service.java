package com.apiweb.backend.Service;

import com.apiweb.backend.config.AwsProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final AwsProperties awsProperties;

    public S3Service(S3Client s3Client, AwsProperties awsProperties) {
        this.s3Client = s3Client;
        this.awsProperties = awsProperties;
    }

    public String subirArchivo(MultipartFile archivo) throws IOException {
        String nombreArchivo = UUID.randomUUID() + "_" + archivo.getOriginalFilename();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(awsProperties.getBucketName())
                .key(nombreArchivo)
                .contentType(archivo.getContentType())
                //.acl(ObjectCannedACL.PUBLIC_READ)
                .build();
 
        s3Client.putObject(request, RequestBody.fromBytes(archivo.getBytes()));

        return "https://" + awsProperties.getBucketName() + ".s3." +
                awsProperties.getRegion() + ".amazonaws.com/" + nombreArchivo;
    }
}