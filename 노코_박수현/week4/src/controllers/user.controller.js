import { StatusCodes } from "http-status-codes";
import { bodyToUser, bodyToUserAgree, bodyToMissionComplete, bodyToSocial } from "../dtos/user.dto.js";
import { userSignUp, userAgreeAddition, listUserReviews, listUserMissions, CompleteUserMission, userSocialSignUp } from "../services/user.service.js";
import { NotSocialError } from "../errors.js";
// 유저 회원가입
export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            gender: { type: "string" },
            age: { type: "number" },
            address: { type: "string"},
            specAddress: { type: "string" },
            phoneNum: { type: "string" },
            status: { type: "string" },
            email: { type: "string" },
            point: {type: "number"},
            preferences: { type: "array", items: { type: "number" } }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "회원 가입 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                email: { type: "string" },
                name: { type: "string" },
                preferCategory: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "회원 가입 이메일 중복 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U003" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "회원 가입 찾을 수 없는 id 값 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    return next(err);
  }
};

// 유저 약관 동의
export const handleUserAgreeAddition = async (req, res, next) => {
  /*
#swagger.summary = '유저 약관 동의 API';
#swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            terms: { type: "array", items: { type: "number" } }
          }
        }
      }
    }
  };
#swagger.responses[200] = {
description: "유저 약관 동의 성공 응답",
content: {
  "application/json": {
    schema: {
      type: "object",
      properties: {
        resultType: { type: "string", example: "SUCCESS" },
        error: { type: "object", nullable: true, example: null },
        success: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  termsId: { type: "number" },
                }
              }
            }        
          }
        }
      }
    }
  }
}
};
#swagger.responses[401] = {
  description: "유저 약관 동의 로그인으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U006" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
#swagger.responses[404] = {
  description: "유저 약관 동의 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U001" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
*/
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    console.log("약관 동의를 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

    const user = await userAgreeAddition(bodyToUserAgree(req.user, req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    return next(err)
  }
};

// 내가 작성한 리뷰 목록 불러오기
export const handleListUserReviews = async (req, res, next) => {
  /*
#swagger.summary = '내가 작성한 리뷰 목록 조회 API';
#swagger.responses[200] = {
 description: "내가 작성한 리뷰 목록 조회 성공 응답",
 content: {
   "application/json": {
     schema: {
       type: "object",
       properties: {
         resultType: { type: "string", example: "SUCCESS" },
         error: { type: "object", nullable: true, example: null },
         success: {
           type: "object",
           properties: {
             data: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   id: { type: "number" },
                   body: { type: "string"},
                   score: { type: "number"},
                   storeId: { type: "number"},
                   memberId: { type: "number"},
                   store: { type: "object", properties: { id: { type: "number" }, regionId:{ type: "number" },  name: { type: "string" }, address: { type: "string" }, score: {type: "number", format: "float" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  } } },
                   member: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, gender: { type: "string" }, age: { type: "number" }, address: { type: "string" }, specAddress: { type: "string" }, phoneNum: { type: "string" }, status: { type: "string" }, inactiveDate: { type: "string" }, socialType: { type: "string", format: "date" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  }, email: { type: "string" }, point: { type: "number" }  } }, 
                 }
               }
             },
             pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
           }
         }
       }
     }
   }
 }
};
#swagger.responses[400] = {
    description: "내가 작성한 리뷰 목록 커서 초과 조회 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U002" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[401] = {
  description: "내가 작성한 리뷰 목록 로그인으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U006" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
  #swagger.responses[404] = {
    description: "내가 작성한 리뷰 목록 id 값 조회 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/

  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    const reviews = await listUserReviews(
      parseInt(req.user.id),
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    return next(err)
  }
};

// 내가 진행 중인 미션 목록 불러오기
export const handleListUserMissions = async (req, res, next) => {
  /*
#swagger.summary = '내가 진행 중인 미션 목록 조회 API';
#swagger.responses[200] = {
  description: "내가 진행 중인 미션 목록 조회 성공 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    member: { type: "object", properties: { id: { type: "number" }, name: { type: "string" }, gender: { type: "string" }, age: { type: "number" }, address: { type: "string" }, specAddress: { type: "string" }, phoneNum: { type: "string" }, status: { type: "string" }, inactiveDate: { type: "string" }, socialType: { type: "string", format: "date" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  }, email: { type: "string" }, point: { type: "number" }  } }, 
                    memberId: { type: "number"},
                    mission: { type: "object", properties: { id: { type: "number" }, storeId:{ type: "number" },  reward: { type: "number" }, deadline: { type: "string", format: "date" }, missionSpec: {type: "string", format: "float" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  } } },
                    missionId: { type: "number" },
                    status: { type: "string"},
                  }
                }
              },
              pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
            }
          }
        }
      }
    }
  }
};
#swagger.responses[400] = {
    description: "내가 진행 중인 미션 목록 조회 커서 초과 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U002" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
    #swagger.responses[401] = {
  description: "내가 진행 중인 미션 목록 조회 로그인으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U006" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
  #swagger.responses[404] = {
    description: "내가 진행 중인 미션 목록 조회 id 값 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    const missions = await listUserMissions(
      parseInt(req.user.id),
      req.query.status,
      typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
    );
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    return next(err)
  }
};

// 내가 진행 중인 미션을 진행 완료로 바꾸기
export const handleUserMissionComplete = async (req, res, next) => {
  /*
#swagger.summary = '내가 진행 중인 미션을 진행 완료로 바꾸기 API';
 #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: { type: "string" },
          }
        }
      }
    }
  };
#swagger.responses[200] = {
description: "내가 진행 중인 미션을 진행 완료로 바꾸기 성공 응답",
content: {
 "application/json": {
   schema: {
     type: "object",
     properties: {
       resultType: { type: "string", example: "SUCCESS" },
       error: { type: "object", nullable: true, example: null },
       success: {
         type: "object",
         properties: {
           data: {
             type: "array",
             items: {
               type: "object",
               properties: {
               missionComplete: { type: "object", properties: { id: { type: "number" }, memberId: { type: "number" }, missionId: { type: "number" }, status: { type: "string" }, createdAt: { type: "string", format: "date" }, updatedAt: {  type: "string", format: "date"  }} }, 
               }
             }
           },
           pagination: { type: "object", properties: { cursor: { type: "number", nullable: true } }}
         }
       }
     }
   }
 }
}
};
#swagger.responses[400] = {
  description: "내가 진행 중인 미션을 진행 완료로 바꾸기 이미 진행중으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U004" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
#swagger.responses[401] = {
  description: "내가 진행 중인 미션을 진행 완료로 바꾸기 로그인으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U006" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
#swagger.responses[404] = {
  description: "내가 진행 중인 미션을 진행 완료로 바꾸기 미션을 찾을 수 없음으로 인한 실패 응답",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAIL" },
          error: {
            type: "object",
            properties: {
              errorCode: { type: "string", example: "U001" },
              reason: { type: "string" },
              data: { type: "object" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  }
};
*/
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    const missions = await CompleteUserMission(bodyToMissionComplete(req.body),
      parseInt(req.user.id),
      parseInt(req.params.missionId)
    );
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    return next(err)
  }
};

export const handleUserSocialSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '소셜 회원 가입 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: { type : "number" },
            name: { type: "string" },
            gender: { type: "string" },
            age: { type: "number" },
            address: { type: "string" },
            specAddress: { type: "string" },
            phoneNum: { type: "string" },
            status: { type: "string" },
            socialType: {type: "string"},
            email: { type: "string" },
            point: { type: "number" },
            preferences: { type: "array", items: { type: "number" } }
          }
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "소셜 회원가입 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                email: { type: "string" },
                name: { type: "string" },
                preferCategory: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[401] = {
    description: "소셜로 접근하지 않음 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U006" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  #swagger.responses[404] = {
    description: "카테고리 id 값 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string" },
                data: { type: "object" }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
  */
  try {
    if (!req.user) {
      throw new NotSocialError("소셜 로그인을 해주세요.", req.user)
    }
    const user = await userSocialSignUp(bodyToSocial(req.user, req.body));
    res.status(StatusCodes.OK).success(user)
  } catch (err) {
    return next(err);
  }
}