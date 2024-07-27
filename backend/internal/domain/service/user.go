package service

type UserService struct {
}

func NewUserService() *UserService {
	return &UserService{}
}

func (s *UserService) Create() error {
	return nil
}

func (s *UserService) Update() error {
	return nil
}

func (s *UserService) Search() error {
	return nil
}

func (s *UserService) Get() error {
	return nil
}
